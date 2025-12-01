document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const gameCards = Array.from(document.querySelectorAll(".game-card"));
  const randomBtn = document.getElementById("randomGameBtn");
  const yearSpan = document.getElementById("year");

  // Footer year
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Filtering
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter") || "all";

      // Update active state
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Show/hide cards
      gameCards.forEach((card) => {
        const topic = card.getAttribute("data-topic");
        if (filter === "all" || topic === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // Random game
  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      // Only choose from visible cards (not .hidden)
      const visibleCards = gameCards.filter(
        (card) => !card.classList.contains("hidden")
      );

      if (visibleCards.length === 0) return;

      const randomIndex = Math.floor(Math.random() * visibleCards.length);
      const randomCard = visibleCards[randomIndex];
      const link = randomCard.querySelector(".play-btn");

      if (link && link.href) {
        window.location.href = link.href;
      }
    });
  }
});
