(function(){
  function ytIdFromUrl(url){
    if(!url) return "";
    url = url.trim();
    // Already an ID
    if(/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

    // youtu.be/<id>
    let m = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if(m) return m[1];

    // youtube.com/watch?v=<id>
    m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if(m) return m[1];

    // youtube.com/embed/<id>
    m = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if(m) return m[1];

    return "";
  }

  function wireVideoBlocks(){
    document.querySelectorAll("[data-video-block]").forEach(function(block){
      const input = block.querySelector("input");
      const btn = block.querySelector("button");
      const embed = block.querySelector(".embed");
      const frame = block.querySelector("iframe");
      const hint = block.querySelector(".hint");

      function apply(){
        const id = ytIdFromUrl(input.value);
        if(!id){
          embed.style.display="none";
          frame.src="";
          hint.textContent = "Paste a YouTube link above (or an 11‑char video ID).";
          return;
        }
        embed.style.display="block";
        frame.src = "https://www.youtube.com/embed/" + id;
        hint.textContent = "Embedded video preview (students: watch ~30s, pause, do the step, repeat).";
      }

      btn.addEventListener("click", apply);
      input.addEventListener("keydown", function(e){
        if(e.key==="Enter"){ e.preventDefault(); apply(); }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", wireVideoBlocks);
})();



  // Auto-load video on specific pages using the existing video block system
  document.addEventListener("DOMContentLoaded", function(){
    if (window.location.pathname.includes("12-asset-table.html")) {
      const block = document.querySelector("[data-video-block]");
      if(block){
        const input = block.querySelector("input");
        const btn = block.querySelector("button");
        if(input && btn){
          input.value = "G57o4DbzXq4";
          btn.click(); // triggers the normal embed logic
        }
      }
    }
  });


/* Default video per page (optional)
   Add data-default-video="YOUTUBE_ID" to the [data-video-block] container to auto-embed on load. */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-video-block]").forEach((block) => {
    const iframe = block.querySelector(".embed iframe");
    if (!iframe) return;

    const defaultId = block.getAttribute("data-default-video");
    const defaultTitle = block.getAttribute("data-default-title") || "Support video";

    // Only set a default if iframe has no src yet
    if (defaultId && (!iframe.getAttribute("src") || iframe.getAttribute("src") === "")) {
      iframe.setAttribute("src", `https://www.youtube.com/embed/${defaultId}`);
      iframe.setAttribute("title", defaultTitle);
    }
  });
});
