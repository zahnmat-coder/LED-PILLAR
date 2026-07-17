(function(){
  var env = window.LED_PILLAR_ENV || {};
  var client = null;
  var orders = [];
  var selectedOrder = null;
  var money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

  function esc(s){ return String(s || "").replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function fmtMoney(cents, currency){ return new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD" }).format((cents || 0) / 100); }
  function statusLabel(s){ return String(s || "").replace(/_/g, " "); }
  function byId(id){ return document.getElementById(id); }

  function setStatus(id, text, error){
    var node = byId(id);
    if(!node) return;
    node.textContent = text || "";
    node.className = "status" + (error ? " error" : "");
  }

  function initClient(){
    if(!window.supabase || !env.SUPABASE_URL || !env.SUPABASE_ANON_KEY || /YOUR_PROJECT_REF/.test(env.SUPABASE_URL)){
      setStatus("loginStatus", "Supabase admin login is not configured.", true);
      return false;
    }
    client = window.supabase.createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return true;
  }

  async function checkSession(){
    if(!client) return;
    var result = await client.auth.getSession();
    if(result.data.session) showAdmin();
  }

  async function login(e){
    e.preventDefault();
    if(!client) return;
    var data = new FormData(e.currentTarget);
    setStatus("loginStatus", "Signing in...");
    var result = await client.auth.signInWithPassword({
      email: data.get("email"),
      password: data.get("password")
    });
    if(result.error){
      setStatus("loginStatus", result.error.message, true);
      return;
    }
    showAdmin();
  }

  async function showAdmin(){
    byId("loginPanel").classList.add("hidden");
    byId("adminApp").classList.remove("hidden");
    byId("signOutBtn").classList.remove("hidden");
    await loadOrders();
  }

  async function signOut(){
    await client.auth.signOut();
    location.reload();
  }

  function queryBase(){
    var q = client.from("orders").select("*, uploaded_artwork(*), order_items(*), order_status_history(*)").order("created_at", { ascending: false }).limit(100);
    var payment = byId("paymentFilter").value;
    var production = byId("productionFilter").value;
    var from = byId("dateFrom").value;
    var to = byId("dateTo").value;
    if(payment) q = q.eq("payment_status", payment);
    if(production) q = q.eq("production_status", production);
    if(from) q = q.gte("created_at", from + "T00:00:00");
    if(to) q = q.lte("created_at", to + "T23:59:59");
    return q;
  }

  async function loadOrders(){
    var body = byId("ordersBody");
    body.innerHTML = "<tr><td colspan='4'>Loading orders...</td></tr>";
    var result = await queryBase();
    if(result.error){
      body.innerHTML = "<tr><td colspan='4'>" + esc(result.error.message) + "</td></tr>";
      return;
    }
    orders = result.data || [];
    renderMetrics();
    renderOrders();
  }

  function filteredOrders(){
    var needle = byId("searchInput").value.trim().toLowerCase();
    if(!needle) return orders;
    return orders.filter(function(order){
      var text = [
        order.order_number,
        order.customer_name,
        order.customer_email,
        order.customization && order.customization.customText
      ].join(" ").toLowerCase();
      return text.indexOf(needle) >= 0;
    });
  }

  function renderMetrics(){
    var paid = orders.filter(function(o){ return o.payment_status === "paid"; });
    var revenue = paid.reduce(function(sum, o){ return sum + Number(o.total_amount_cents || 0); }, 0);
    byId("metricRevenue").textContent = money.format(revenue / 100);
    byId("metricNew").textContent = paid.filter(function(o){ return o.production_status === "awaiting_proof" || o.production_status === "not_started"; }).length;
    byId("metricAwaiting").textContent = orders.filter(function(o){ return o.payment_status === "awaiting_payment"; }).length;
    byId("metricProduction").textContent = orders.filter(function(o){ return o.production_status === "in_production"; }).length;
  }

  function renderOrders(){
    var body = byId("ordersBody");
    var rows = filteredOrders();
    if(!rows.length){
      body.innerHTML = "<tr><td colspan='4'>No orders match those filters.</td></tr>";
      return;
    }
    body.innerHTML = rows.map(function(order){
      return "<tr data-id='" + esc(order.id) + "'>" +
        "<td><b>" + esc(order.order_number) + "</b><br><small>" + esc(new Date(order.created_at).toLocaleDateString()) + "</small></td>" +
        "<td>" + esc(order.customer_name) + "<br><small>" + esc(order.customer_email) + "</small></td>" +
        "<td>" + fmtMoney(order.total_amount_cents, order.currency) + "</td>" +
        "<td><span class='pill'>" + esc(statusLabel(order.payment_status)) + "</span><br><span class='pill muted'>" + esc(statusLabel(order.production_status)) + "</span></td>" +
      "</tr>";
    }).join("");
    body.querySelectorAll("tr[data-id]").forEach(function(row){
      row.addEventListener("click", function(){
        selectedOrder = orders.find(function(order){ return order.id === row.getAttribute("data-id"); });
        renderDetail();
      });
    });
  }

  function priceRows(order){
    var rows = Array.isArray(order.price_breakdown) ? order.price_breakdown : [];
    return rows.map(function(row){
      return "<li><span>" + esc(row.kind) + ": " + esc(row.label) + "</span><strong>" + fmtMoney(row.amountCents, order.currency) + "</strong></li>";
    }).join("");
  }

  function historyRows(order){
    var rows = (order.order_status_history || []).slice().sort(function(a,b){ return new Date(b.created_at) - new Date(a.created_at); });
    if(!rows.length) return "<p>No status history yet.</p>";
    return rows.map(function(row){
      return "<p><b>" + esc(statusLabel(row.status)) + "</b><br><small>" + esc(new Date(row.created_at).toLocaleString()) + "</small><br>" + esc(row.note || "") + "</p>";
    }).join("");
  }

  async function signedArtworkUrl(order){
    var art = order.uploaded_artwork && order.uploaded_artwork[0];
    if(!art) return null;
    var result = await client.storage.from(art.storage_bucket).createSignedUrl(art.storage_path, 300, {
      download: art.original_filename
    });
    if(result.error) throw result.error;
    return result.data.signedUrl;
  }

  async function downloadArtwork(){
    if(!selectedOrder) return;
    try{
      var url = await signedArtworkUrl(selectedOrder);
      if(!url) return alert("No artwork uploaded for this order.");
      location.href = url;
    }catch(err){
      alert(err.message);
    }
  }

  async function saveOrderUpdates(){
    if(!selectedOrder) return;
    var production = byId("detailProductionStatus").value;
    var tracking = byId("detailTracking").value.trim();
    var notes = byId("detailInternalNotes").value.trim();
    var result = await client.from("orders").update({
      production_status: production,
      tracking_number: tracking || null,
      internal_seller_notes: notes || null
    }).eq("id", selectedOrder.id).select().single();
    if(result.error) return alert(result.error.message);

    await client.from("order_status_history").insert({
      order_id: selectedOrder.id,
      status_type: "production",
      status: production,
      note: "Seller updated order status."
    });
    await loadOrders();
    selectedOrder = orders.find(function(order){ return order.id === result.data.id; }) || result.data;
    renderDetail();
  }

  async function markRefund(){
    if(!selectedOrder) return;
    var result = await client.from("orders").update({
      payment_status: "refunded",
      production_status: "cancelled"
    }).eq("id", selectedOrder.id);
    if(result.error) return alert(result.error.message);
    await client.from("order_status_history").insert({
      order_id: selectedOrder.id,
      status_type: "payment",
      status: "refunded",
      note: "Seller recorded refund in admin. Confirm it exists in Stripe."
    });
    await loadOrders();
  }

  function renderDetail(){
    if(!selectedOrder) return;
    var order = selectedOrder;
    var c = order.customization || {};
    var s = order.shipping || {};
    var art = order.uploaded_artwork && order.uploaded_artwork[0];
    byId("orderDetail").innerHTML = "<h2>" + esc(order.order_number) + "</h2>" +
      "<p class='sub'>" + esc(order.customer_name) + " · " + esc(order.customer_email) + " · " + esc(order.customer_phone) + "</p>" +
      "<div class='detail-grid'>" +
        "<div class='detail-box'><h3>Design Choices</h3><p><b>Text:</b> " + esc(c.customText || "Pure glow") + "</p><p><b>Size:</b> " + esc(c.size) + "</p><p><b>Finish:</b> " + esc(c.finish) + "</p><p><b>Color:</b> " + esc(c.color) + "</p><p><b>Font:</b> " + esc(c.font) + "</p><p><b>Font size:</b> " + esc(c.fontSize || "large") + "</p><p><b>Alignment:</b> " + esc(c.alignment) + "</p><p><b>Orientation:</b> " + esc(c.orientation) + "</p><p><b>Sides:</b> " + esc(c.sides) + "</p><p><b>Quantity:</b> " + esc(order.quantity) + "</p></div>" +
        "<div class='detail-box'><h3>Shipping</h3><p>" + esc(s.line1) + "</p><p>" + esc(s.line2) + "</p><p>" + esc(s.city) + ", " + esc(s.state) + " " + esc(s.postalCode) + "</p><p>" + esc(s.country) + "</p></div>" +
        "<div class='detail-box'><h3>Payment</h3><p><b>Status:</b> " + esc(statusLabel(order.payment_status)) + "</p><p><b>Stripe Session:</b> " + esc(order.stripe_checkout_session_id) + "</p><p><b>Payment Intent:</b> " + esc(order.stripe_payment_intent_id) + "</p><p><b>Total:</b> " + fmtMoney(order.total_amount_cents, order.currency) + "</p></div>" +
        "<div class='detail-box'><h3>Artwork</h3><p>" + esc(art ? art.original_filename : "No artwork uploaded") + "</p><button class='btn ghost' id='downloadArtworkBtn' type='button'>Download Artwork</button></div>" +
      "</div>" +
      "<div class='detail-box'><h3>Price Breakdown</h3><ul class='price-list'>" + priceRows(order) + "</ul></div>" +
      "<div class='detail-box'><h3>Customer Instructions</h3><p>" + esc(order.customer_notes || "None") + "</p></div>" +
      "<div class='detail-box no-print'><h3>Seller Controls</h3>" +
        "<label class='field'><span>Production Status</span><select id='detailProductionStatus'><option value='not_started'>Not started</option><option value='awaiting_proof'>Awaiting proof</option><option value='awaiting_customer_approval'>Awaiting customer approval</option><option value='in_production'>In production</option><option value='shipped'>Shipped</option><option value='cancelled'>Cancelled</option></select></label>" +
        "<label class='field'><span>Tracking Number</span><input id='detailTracking' value='" + esc(order.tracking_number || "") + "'></label>" +
        "<label class='field'><span>Internal Notes</span><textarea id='detailInternalNotes'>" + esc(order.internal_seller_notes || "") + "</textarea></label>" +
        "<div class='toolbar'><button class='btn primary' id='saveDetailBtn' type='button'>Save</button><button class='btn ghost' id='printBtn' type='button'>Print Build Sheet</button><button class='btn ghost' id='refundBtn' type='button'>Record Refund</button><a class='btn ghost' href='mailto:" + esc(order.customer_email) + "?subject=Question about order " + esc(order.order_number) + "'>Request Clarification</a></div>" +
      "</div>" +
      "<div class='detail-box'><h3>Status History</h3>" + historyRows(order) + "</div>";
    byId("detailProductionStatus").value = order.production_status;
    byId("downloadArtworkBtn").addEventListener("click", downloadArtwork);
    byId("saveDetailBtn").addEventListener("click", saveOrderUpdates);
    byId("printBtn").addEventListener("click", function(){ window.print(); });
    byId("refundBtn").addEventListener("click", markRefund);
  }

  function bind(){
    byId("loginForm").addEventListener("submit", login);
    byId("signOutBtn").addEventListener("click", signOut);
    byId("refreshBtn").addEventListener("click", loadOrders);
    ["searchInput","paymentFilter","productionFilter","dateFrom","dateTo"].forEach(function(id){
      byId(id).addEventListener(id === "searchInput" ? "input" : "change", function(){
        if(id === "searchInput") renderOrders();
        else loadOrders();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    bind();
    if(initClient()) checkSession();
  });
})();
