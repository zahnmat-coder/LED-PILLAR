(function(){
  function esc(s){ return String(s || "").replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function money(cents, currency){ return new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD" }).format((cents || 0) / 100); }
  async function init(){
    var params = new URLSearchParams(location.search);
    var sessionId = params.get("session_id");
    var env = window.LED_PILLAR_ENV || {};
    var content = document.getElementById("confirmationContent");
    if(!env.FUNCTIONS_BASE_URL || /YOUR_PROJECT_REF/.test(env.FUNCTIONS_BASE_URL)){
      document.getElementById("confirmTitle").textContent = "Order lookup is not connected yet";
      content.innerHTML = "<p class='status error'>Connect js/supabase-config.js before live order confirmations.</p>";
      return;
    }
    if(!sessionId){
      document.getElementById("confirmTitle").textContent = "Missing checkout session";
      content.innerHTML = "<p class='status error'>Open this page from the Stripe success redirect.</p>";
      return;
    }
    try{
      var res = await fetch(env.FUNCTIONS_BASE_URL.replace(/\/$/, "") + "/order-confirmation?session_id=" + encodeURIComponent(sessionId));
      var order = await res.json();
      if(!res.ok) throw new Error(order.error || "Order not found.");
      document.getElementById("confirmTitle").textContent = "Order " + order.order_number;
      document.getElementById("confirmSub").textContent = "Payment status: " + order.payment_status + ". Save this page for your records.";
      var customization = order.customization || {};
      var shipping = order.shipping || {};
      content.innerHTML = "<div class='detail-grid'>" +
        "<div class='detail-box'><h3>Customization</h3><p><b>Text:</b> " + esc(customization.customText) + "</p><p><b>Size:</b> " + esc(customization.size) + "</p><p><b>Color:</b> " + esc(customization.color) + "</p><p><b>Font:</b> " + esc(customization.font) + "</p><p><b>Font size:</b> " + esc(customization.fontSize || "large") + "</p><p><b>Panels:</b> " + esc(customization.sides) + "</p><p><b>Quantity:</b> " + esc(order.quantity) + "</p></div>" +
        "<div class='detail-box'><h3>Shipping</h3><p>" + esc(shipping.line1) + "</p><p>" + esc(shipping.line2) + "</p><p>" + esc(shipping.city) + ", " + esc(shipping.state) + " " + esc(shipping.postalCode) + "</p><p>" + esc(shipping.country) + "</p></div>" +
        "<div class='detail-box'><h3>Artwork</h3><p>" + esc(order.artwork_filename || "No artwork uploaded") + "</p></div>" +
        "<div class='detail-box'><h3>Total Paid</h3><p style='font-size:2rem;font-family:var(--display);margin:0'>" + money(order.total_amount_cents, order.currency) + "</p></div>" +
      "</div>";
    }catch(err){
      document.getElementById("confirmTitle").textContent = "Order lookup failed";
      content.innerHTML = "<p class='status error'>" + esc(err.message) + "</p>";
    }
  }
  document.addEventListener("DOMContentLoaded", init);
})();
