// Fullscreen lightbox for topic-page infographics
(function () {
  function ensureLightbox() {
    var existing = document.getElementById("infographicLightbox");
    if (existing) return existing;

    var overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.id = "infographicLightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Infographic fullscreen view");

    var content = document.createElement("div");
    content.className = "lightbox-content";

    var img = document.createElement("img");
    img.className = "lightbox-img";
    img.alt = "";

    var close = document.createElement("button");
    close.type = "button";
    close.className = "lightbox-close";
    close.setAttribute("aria-label", "Close infographic");
    close.innerHTML = "&times;";

    content.appendChild(close);
    content.appendChild(img);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    function closeLightbox() {
      overlay.classList.remove("open");
      overlay.style.display = "none";
      img.src = "";
      // restore focus if possible
      if (overlay._lastFocus && typeof overlay._lastFocus.focus === "function") {
        overlay._lastFocus.focus();
      }
    }

    close.addEventListener("click", closeLightbox);

    overlay.addEventListener("click", function (e) {
      // Click outside the image/content closes
      if (e.target === overlay) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("open")) {
        closeLightbox();
      }
    });

    overlay._open = function (src, alt, fromEl) {
      overlay._lastFocus = fromEl || document.activeElement;
      img.src = src;
      img.alt = alt || "Infographic";
      overlay.style.display = "flex";
      overlay.classList.add("open");
      // focus close button for accessibility
      setTimeout(function () { close.focus(); }, 0);
    };

    return overlay;
  }

  function isProbablyInfographic(imgEl) {
    if (!imgEl || !imgEl.getAttribute) return false;
    if (imgEl.closest && imgEl.closest(".no-lightbox")) return false;
    if (imgEl.getAttribute("data-lightbox") === "off") return false;

    var cls = imgEl.className || "";
    if (typeof cls === "string" && cls.indexOf("topic-infographic") !== -1) return true;

    // container-based
    if (imgEl.closest && imgEl.closest(".topic-infographic")) return true;
    if (imgEl.closest && imgEl.closest("figure.infographic-figure")) return true;

    var src = imgEl.getAttribute("src") || "";
    if (src.toLowerCase().indexOf("infographic") !== -1) return true;

    return false;
  }

  function wireUp() {
    var lb = ensureLightbox();
    // Broad scan – we filter aggressively to only infographic-like images
    var imgs = Array.prototype.slice.call(document.querySelectorAll("img"));
    imgs.forEach(function (img) {
      if (!isProbablyInfographic(img)) return;
      // Avoid double-binding
      if (img.getAttribute("data-lightbox-wired") === "1") return;

      img.classList.add("infographic-clickable");
      img.addEventListener("click", function () {
        var src = img.getAttribute("src");
        if (!src) return;
        lb._open(src, img.getAttribute("alt") || "", img);
      });

      // A11y: allow keyboard open when image is focused
      if (!img.hasAttribute("tabindex")) img.setAttribute("tabindex", "0");
      img.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          var src = img.getAttribute("src");
          if (!src) return;
          lb._open(src, img.getAttribute("alt") || "", img);
        }
      });

      img.setAttribute("data-lightbox-wired", "1");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireUp);
  } else {
    wireUp();
  }
})(); 
