(function(){
  var options = window.LED_PILLAR_OPTIONS;
  var env = window.LED_PILLAR_ENV || {};
  var money = new Intl.NumberFormat("en-US", { style: "currency", currency: options.currency });
  var state = {
    size: "desktop-12",
    finish: "gray",
    color: "cyan",
    font: "real-style",
    fontSize: "xl",
    alignment: "center",
    orientation: "vertical",
    sides: "front-side",
    quantity: 1,
    upgrades: [],
    customText: "ST. PETE PIER",
    rotation: 34,
    checkoutRequestId: (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : String(Date.now()) + "-" + Math.random().toString(16).slice(2)
  };

  function byId(list, id){ return list.find(function(item){ return item.id === id; }) || list[0]; }
  function cents(value){ return money.format(value / 100); }
  function getForm(){ return document.getElementById("orderForm"); }
  function el(tag, cls, html){ var node = document.createElement(tag); if(cls) node.className = cls; if(html != null) node.innerHTML = html; return node; }
  function esc(s){ return String(s || "").replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }

  function estimate(){
    var size = byId(options.sizes, state.size);
    var finish = byId(options.finishes, state.finish);
    var color = byId(options.colors, state.color);
    var font = byId(options.fonts, state.font);
    var fontSize = byId(options.fontSizes, state.fontSize);
    var alignment = byId(options.alignments, state.alignment);
    var orientation = byId(options.orientations, state.orientation);
    var sides = byId(options.sides, state.sides);
    var selectedUpgrades = options.upgrades.filter(function(u){ return state.upgrades.indexOf(u.id) >= 0; });
    var one = size.priceCents + finish.priceCents + color.priceCents + font.priceCents + fontSize.priceCents + alignment.priceCents + orientation.priceCents + sides.priceCents + selectedUpgrades.reduce(function(sum, u){ return sum + u.priceCents; }, 0);
    var qty = Math.max(1, Number(state.quantity) || 1);
    return {
      rows: [
        ["Base size", size.label, size.priceCents],
        ["Frame finish", finish.label, finish.priceCents],
        ["Light color", color.label, color.priceCents],
        ["Font", font.label, font.priceCents],
        ["Font size", fontSize.label, fontSize.priceCents],
        ["Alignment", alignment.label, alignment.priceCents],
        ["Orientation", orientation.label, orientation.priceCents],
        ["Printed panels", sides.label, sides.priceCents]
      ].concat(selectedUpgrades.map(function(u){ return ["Upgrade", u.label, u.priceCents]; })),
      quantity: qty,
      unitAmountCents: one,
      totalAmountCents: one * qty
    };
  }

  function renderSelect(name, list){
    var wrap = el("label", "field");
    wrap.innerHTML = "<span>" + name.replace(/([A-Z])/g, " $1").replace(/^./, function(c){ return c.toUpperCase(); }) + "</span>";
    var select = el("select");
    select.name = name;
    list.forEach(function(item){
      var option = el("option");
      option.value = item.id;
      option.textContent = item.label + (item.priceCents ? " +" + cents(item.priceCents) : "");
      select.appendChild(option);
    });
    select.value = state[name];
    select.addEventListener("change", function(){ state[name] = select.value; render(); });
    wrap.appendChild(select);
    return wrap;
  }

  function renderControls(){
    var controls = document.getElementById("optionControls");
    controls.innerHTML = "";
    controls.appendChild(renderSelect("size", options.sizes));
    controls.appendChild(renderSelect("finish", options.finishes));
    controls.appendChild(renderSelect("color", options.colors));
    controls.appendChild(renderSelect("font", options.fonts));
    controls.appendChild(renderSelect("fontSize", options.fontSizes));
    controls.appendChild(renderSelect("alignment", options.alignments));
    controls.appendChild(renderSelect("orientation", options.orientations));
    controls.appendChild(renderSelect("sides", options.sides));

    var upgrades = el("fieldset", "upgrade-box");
    upgrades.innerHTML = "<legend>Upgrades</legend>";
    options.upgrades.forEach(function(upgrade){
      var label = el("label", "check-row");
      label.innerHTML = "<input type='checkbox' value='" + esc(upgrade.id) + "'> <span>" + esc(upgrade.label) + " +" + cents(upgrade.priceCents) + "</span>";
      var input = label.querySelector("input");
      input.checked = state.upgrades.indexOf(upgrade.id) >= 0;
      input.addEventListener("change", function(){
        state.upgrades = Array.prototype.slice.call(upgrades.querySelectorAll("input:checked")).map(function(n){ return n.value; });
        render();
      });
      upgrades.appendChild(label);
    });
    controls.appendChild(upgrades);
  }

  function renderPreview(){
    var color = byId(options.colors, state.color);
    var finish = byId(options.finishes, state.finish);
    var font = byId(options.fonts, state.font);
    var fontSize = byId(options.fontSizes, state.fontSize);
    var text = state.customText.trim();
    var scale = (fontSize.scale || 100) / 100;
    var fit = Math.max(22, Math.min(46, Math.round((360 / Math.max(text.length, 1)) * 1.08 * scale)));
    var spacing = Math.max(0.07, Math.min(0.18, 2.05 / Math.max(text.length, 1)));
    ["livePreview","reviewPreview"].forEach(function(id){
      var stage = document.getElementById(id);
      if(!stage) return;
      var isReview = id === "reviewPreview";
      stage.style.setProperty("--panel", color.hex);
      stage.style.setProperty("--scene-glow", color.hex);
      stage.style.setProperty("--frame", finish.color);
      stage.style.setProperty("--preview-font", font.family);
      stage.style.setProperty("--spin", state.rotation + "deg");
      stage.classList.toggle("horizontal", state.orientation === "horizontal");
      stage.classList.toggle("front-only", state.sides === "front");
      stage.classList.toggle("front-side", state.sides === "front-side");
      stage.classList.toggle("all-panels", state.sides === "all-panels");
      stage.classList.toggle("align-top", state.alignment === "top");
      stage.classList.toggle("align-bottom", state.alignment === "bottom");
      stage.querySelectorAll(".preview-text").forEach(function(node){
        node.textContent = text;
        node.style.fontSize = (isReview ? Math.max(10, Math.round(fit * 0.38)) : fit) + "px";
        node.style.letterSpacing = (isReview ? Math.max(0.07, spacing * 0.85) : spacing) + "em";
      });
    });
    var rotate = document.getElementById("orderRotate");
    if(rotate) rotate.value = state.rotation;
    var reviewRotate = document.getElementById("reviewRotate");
    if(reviewRotate) reviewRotate.value = state.rotation;
    var rotateLabel = document.getElementById("orderRotateLabel");
    if(rotateLabel) rotateLabel.textContent = spinLabel(state.rotation);
    var reviewRotateLabel = document.getElementById("reviewRotateLabel");
    if(reviewRotateLabel) reviewRotateLabel.textContent = spinLabel(state.rotation);
    var summary = document.getElementById("reviewDesignSummary");
    if(summary){
      summary.textContent = [
        text ? text.toUpperCase() : "Pure glow",
        font.label,
        fontSize.label,
        color.label,
        byId(options.sides, state.sides).label
      ].join(" · ");
    }
  }

  function spinLabel(value){
    var v = ((Number(value) % 360) + 360) % 360;
    if(v > 330 || v <= 25) return "Front";
    if(v > 25 && v <= 75) return "Front + side";
    if(v > 75 && v <= 135) return "Side";
    if(v > 135 && v <= 225) return "Back";
    if(v > 225 && v <= 285) return "Side";
    return "Front + side";
  }

  function renderBreakdown(){
    var data = estimate();
    var list = document.getElementById("priceRows");
    list.innerHTML = "";
    data.rows.forEach(function(row){
      var li = el("li");
      li.innerHTML = "<span><b>" + esc(row[0]) + "</b> " + esc(row[1]) + "</span><strong>" + (row[2] ? cents(row[2]) : "Included") + "</strong>";
      list.appendChild(li);
    });
    document.getElementById("qtySummary").textContent = "Quantity: " + data.quantity;
    document.getElementById("totalSummary").textContent = cents(data.totalAmountCents);
    document.getElementById("serverNote").textContent = "Estimate only. The checkout function recalculates the final total securely on the server.";
  }

  function render(){
    renderPreview();
    renderBreakdown();
  }

  function collectPayload(){
    var form = getForm();
    var data = new FormData(form);
    return {
      checkoutRequestId: state.checkoutRequestId,
      customization: {
        size: state.size,
        finish: state.finish,
        color: state.color,
        customText: state.customText.trim(),
        font: state.font,
        fontSize: state.fontSize,
        alignment: state.alignment,
        orientation: state.orientation,
        sides: state.sides,
        quantity: Math.max(1, Number(state.quantity) || 1),
        upgrades: state.upgrades,
        specialInstructions: data.get("specialInstructions") || ""
      },
      customer: {
        name: data.get("customerName") || "",
        email: data.get("customerEmail") || "",
        phone: data.get("customerPhone") || ""
      },
      shipping: {
        line1: data.get("shippingLine1") || "",
        line2: data.get("shippingLine2") || "",
        city: data.get("shippingCity") || "",
        state: data.get("shippingState") || "",
        postalCode: data.get("shippingPostalCode") || "",
        country: data.get("shippingCountry") || "US"
      }
    };
  }

  function validate(payload){
    var errors = [];
    if(!payload.customization.customText && payload.customization.sides !== "front") errors.push("Add custom text or choose a front-only pure glow setup.");
    if(!payload.customer.name.trim()) errors.push("Customer name is required.");
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.customer.email)) errors.push("Valid customer email is required.");
    if(!payload.customer.phone.trim()) errors.push("Customer phone is required.");
    ["line1","city","state","postalCode","country"].forEach(function(key){ if(!payload.shipping[key].trim()) errors.push("Shipping " + key + " is required."); });
    var artwork = document.getElementById("artwork").files[0];
    if(artwork){
      var allowed = ["image/png","image/jpeg","image/webp","application/pdf","image/svg+xml"];
      if(allowed.indexOf(artwork.type) < 0) errors.push("Artwork must be PNG, JPG, WEBP, SVG, or PDF.");
      if(artwork.size > 8 * 1024 * 1024) errors.push("Artwork must be 8 MB or smaller.");
    }
    return errors;
  }

  function previewSvgFile(){
    var color = byId(options.colors, state.color);
    var finish = byId(options.finishes, state.finish);
    var fontSize = byId(options.fontSizes, state.fontSize);
    var safeText = esc(state.customText.trim().toUpperCase());
    var svgFontSize = Math.round(82 * ((fontSize.scale || 100) / 100));
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='900' height='1200' viewBox='0 0 900 1200'>" +
      "<defs><radialGradient id='bg' cx='50%' cy='62%' r='64%'><stop offset='0' stop-color='#cfcfcf'/><stop offset='1' stop-color='#777'/></radialGradient><linearGradient id='metal' x1='0' x2='1'><stop offset='0' stop-color='#918a82'/><stop offset='.48' stop-color='#5f5a54'/><stop offset='1' stop-color='#aaa49b'/></linearGradient><radialGradient id='glow' cx='52%' cy='48%' r='58%'><stop offset='0' stop-color='#fffaf0'/><stop offset='1' stop-color='" + color.hex + "'/></radialGradient></defs>" +
      "<rect width='900' height='1200' fill='url(#bg)'/><ellipse cx='450' cy='1090' rx='210' ry='36' fill='#000' opacity='.24'/>" +
      "<rect x='360' y='82' width='180' height='940' rx='2' fill='url(#metal)'/><rect x='385' y='118' width='130' height='862' fill='url(#glow)' stroke='#403a35' stroke-width='3'/>" +
      "<rect x='363' y='85' width='174' height='934' fill='none' stroke='#ffffff' stroke-opacity='.22' stroke-width='7'/>" +
      "<text x='452' y='902' transform='rotate(-90 452 902)' text-anchor='middle' font-family='Georgia,serif' font-size='" + svgFontSize + "' font-weight='500' fill='#332d28' letter-spacing='13'>" + safeText + "</text>" +
      "<rect x='389' y='1018' width='122' height='38' rx='3' fill='url(#metal)'/><rect x='266' y='1052' width='368' height='42' rx='12' fill='url(#metal)'/></svg>";
    return new File([svg], "preview.svg", { type: "image/svg+xml" });
  }

  async function submitOrder(e){
    e.preventDefault();
    var status = document.getElementById("orderStatus");
    var payload = collectPayload();
    var errors = validate(payload);
    if(errors.length){
      status.textContent = errors.join(" ");
      status.className = "status error";
      return;
    }
    if(!env.FUNCTIONS_BASE_URL || /YOUR_PROJECT_REF/.test(env.FUNCTIONS_BASE_URL)){
      status.textContent = "Connect js/supabase-config.js before creating live checkout sessions.";
      status.className = "status error";
      return;
    }

    var body = new FormData();
    body.append("payload", JSON.stringify(payload));
    body.append("preview", previewSvgFile());
    var artwork = document.getElementById("artwork").files[0];
    if(artwork) body.append("artwork", artwork);

    status.textContent = "Creating secure checkout...";
    status.className = "status";
    try{
      var res = await fetch(env.FUNCTIONS_BASE_URL.replace(/\/$/, "") + "/create-checkout-session", { method: "POST", body: body });
      var json = await res.json();
      if(!res.ok || !json.url) throw new Error(json.error || "Checkout could not be created.");
      window.location.href = json.url;
    }catch(err){
      status.textContent = err.message;
      status.className = "status error";
    }
  }

  function init(){
    loadDraft();
    renderControls();
    var form = getForm();
    form.customText.value = state.customText;
    form.quantity.value = state.quantity;
    form.customText.addEventListener("input", function(){ state.customText = form.customText.value; render(); });
    form.quantity.addEventListener("input", function(){ state.quantity = Math.max(1, Number(form.quantity.value) || 1); render(); });
    var rotate = document.getElementById("orderRotate");
    if(rotate) rotate.addEventListener("input", function(){ state.rotation = Number(rotate.value) || 0; render(); });
    var reviewRotate = document.getElementById("reviewRotate");
    if(reviewRotate) reviewRotate.addEventListener("input", function(){ state.rotation = Number(reviewRotate.value) || 0; render(); });
    bindPreview360();
    form.addEventListener("submit", submitOrder);
    render();
  }

  function bindPreview360(){
    ["livePreview","reviewPreview"].forEach(function(id){
      var stage = document.getElementById(id);
      var pillar = stage && stage.querySelector(".preview-pillar");
      if(!stage || !pillar) return;
      var dragging = false;
      var startX = 0;
      var startRotation = 0;
      function pointerStart(e){
        if(e.target.closest && e.target.closest("button,input,label,a")) return;
        dragging = true;
        startX = e.clientX;
        startRotation = state.rotation;
        pillar.style.transition = "none";
        stage.setPointerCapture && stage.setPointerCapture(e.pointerId);
      }
      function pointerMove(e){
        if(!dragging) return;
        state.rotation = Math.max(-180, Math.min(180, startRotation + (e.clientX - startX) * .65));
        renderPreview();
      }
      function pointerEnd(e){
        if(!dragging) return;
        dragging = false;
        pillar.style.transition = "";
        stage.releasePointerCapture && stage.releasePointerCapture(e.pointerId);
      }
      stage.addEventListener("pointerdown", pointerStart);
      stage.addEventListener("pointermove", pointerMove);
      stage.addEventListener("pointerup", pointerEnd);
      stage.addEventListener("pointercancel", pointerEnd);
      stage.addEventListener("dblclick", function(e){
        if(e.target.closest && e.target.closest("button,input,label,a")) return;
        state.rotation = 34;
        renderPreview();
      });
    });
  }

  function loadDraft(){
    try{
      var draft = JSON.parse(localStorage.getItem("ledPillarDraft") || "null");
      if(!draft) return;
      var fontMap = { "f-serif": "real-style", "f-grotesk": "real-style", "f-real": "real-style", "f-inter": "clean", "f-script": "script", "f-neon": "bold", "f-retro": "bold", "f-orbit": "clean", "f-hand": "script", "f-round": "clean", "f-bebas": "bold", "f-orbitron": "clean", "f-pacifico": "script", "f-caveat": "script", "f-comfortaa": "clean", "f-monoton": "bold" };
      var sidesMap = { "front": "front", "duo": "front-side", "quad": "all-panels" };
      var sizeMap = { 80: "medium", 85: "medium", 90: "medium", 95: "medium", 100: "medium", 105: "large", 110: "large", 115: "large", 120: "large", 125: "large", 130: "xl", 135: "xl", 140: "xl", 145: "xl", 150: "xl" };
      if(draft.customText) state.customText = String(draft.customText).slice(0, 16);
      if(draft.color && options.colors.some(function(c){ return c.id === draft.color; })) state.color = draft.color;
      if(draft.font && fontMap[draft.font]) state.font = fontMap[draft.font];
      if(draft.fontSize && options.fontSizes.some(function(s){ return s.id === draft.fontSize; })) state.fontSize = draft.fontSize;
      else if(typeof draft.textSize === "number") state.fontSize = sizeMap[Math.round(draft.textSize / 5) * 5] || "xl";
      if(draft.sides && sidesMap[draft.sides]) state.sides = sidesMap[draft.sides];
      if(typeof draft.spin === "number") state.rotation = Math.max(-180, Math.min(180, draft.spin));
      localStorage.removeItem("ledPillarDraft");
    }catch(err){}
  }

  document.addEventListener("DOMContentLoaded", init);
})();
