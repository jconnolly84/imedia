(function () {
  const headings = Array.from(document.querySelectorAll('.topic-section h2'));
  if (!headings.length) return;

  const slugify = (text) => (text || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';

  const used = new Set();
  const items = headings.map((heading, index) => {
    let anchorTarget = heading.previousElementSibling;
    if (!anchorTarget || !anchorTarget.classList || !anchorTarget.classList.contains('topic-anchor-sentinel')) {
      anchorTarget = document.createElement('span');
      anchorTarget.className = 'topic-anchor-sentinel';
      anchorTarget.setAttribute('aria-hidden', 'true');
      heading.parentNode.insertBefore(anchorTarget, heading);
    }

    let id = heading.id || anchorTarget.id || slugify(heading.textContent);
    while (used.has(id)) id = `${id}-${index + 1}`;
    used.add(id);

    anchorTarget.id = id;

    return { id, label: heading.textContent.trim() };
  }).filter(Boolean);

  if (!items.length) return;

  const menu = document.createElement('div');
  menu.className = 'topic-anchor-menu';
  menu.innerHTML = `
    <button type="button" class="topic-anchor-toggle" aria-expanded="false" aria-controls="topicAnchorPanel">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
      </svg>
      <span>On this page</span>
    </button>
    <nav id="topicAnchorPanel" class="topic-anchor-panel" aria-label="Page section shortcuts" hidden>
      <p class="topic-anchor-title">Jump to a section</p>
      <ul class="topic-anchor-list">
        ${items.map((item) => `<li><a class="topic-anchor-link" href="#${item.id}" data-anchor-id="${item.id}">${item.label}</a></li>`).join('')}
      </ul>
      <a class="topic-anchor-top" href="#top">Back to top</a>
    </nav>
  `;

  document.body.appendChild(menu);

  if (!document.getElementById('top')) {
    document.documentElement.id = 'top';
  }

  const toggle = menu.querySelector('.topic-anchor-toggle');
  const panel = menu.querySelector('.topic-anchor-panel');
  const links = Array.from(menu.querySelectorAll('.topic-anchor-link'));

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.hidden = !open;
  };

  toggle.addEventListener('click', () => setOpen(panel.hidden));

  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target)) setOpen(false);
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 701) setOpen(false);
    });
  });

  let currentId = items[0].id;
  const updateActive = (id) => {
    currentId = id || currentId;
    links.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.anchorId === currentId);
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible && visible.target.id) updateActive(visible.target.id);
    }, { rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] });

    items.forEach((item) => {
      const target = document.getElementById(item.id);
      if (target) observer.observe(target);
    });
  }

  updateActive(currentId);
})();
