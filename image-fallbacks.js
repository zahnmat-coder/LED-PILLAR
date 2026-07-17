(function(){
  function makeFallback(img){
    if(!img || img.classList.contains("image-missing")) return;
    var fallback = document.createElement("span");
    fallback.className = "image-fallback";
    fallback.textContent = img.alt || "Image unavailable";
    fallback.setAttribute("role", "img");
    fallback.setAttribute("aria-label", img.alt || "Image unavailable");
    img.classList.add("image-missing");
    img.insertAdjacentElement("afterend", fallback);
  }
  document.querySelectorAll("img").forEach(function(img){
    img.addEventListener("error", function(){ makeFallback(img); });
    if(img.complete && img.naturalWidth === 0) makeFallback(img);
  });
})();
