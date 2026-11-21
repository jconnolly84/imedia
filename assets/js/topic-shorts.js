/* YouTube Shorts for R093 topic pages.
   To add a Short: find the topic's line below, remove the leading //, and replace PASTE_SHORT_ID
   with the video ID (the part after /shorts/ in the link, e.g. youtube.com/shorts/_Pdl6jkoRAw -> _Pdl6jkoRAw).
   Every active line ends with a comma. Topics still commented out show no Shorts block. */
(function () {
  'use strict';

  var SHORTS = {
    'topic-01-traditional-media.html': '_Pdl6jkoRAw',
    'topic-02-new-media.html': 'O-S8ZyxyDy0',
    // 'topic-03-video-audio-music.html': 'PASTE_SHORT_ID',
    // 'topic-04-animation-sfx-vfx.html': 'PASTE_SHORT_ID',
    // 'topic-05-social-media.html': 'PASTE_SHORT_ID',
    // 'topic-06-website-assets.html': 'PASTE_SHORT_ID',
    // 'topic-07-creative-job-roles.html': 'PASTE_SHORT_ID',
    // 'topic-08-technical-job-roles.html': 'PASTE_SHORT_ID',
    // 'topic-09-senior-job-roles.html': 'PASTE_SHORT_ID',
    // 'topic-10-purpose-of-media-products.html': 'PASTE_SHORT_ID',
    // 'topic-11-client-requirements.html': 'PASTE_SHORT_ID',
    // 'topic-12-client-brief-formats.html': 'PASTE_SHORT_ID',
    // 'topic-13-audience-segmentation.html': 'PASTE_SHORT_ID',
    // 'topic-14-audience-research.html': 'PASTE_SHORT_ID',
    // 'topic-15-primary-research.html': 'PASTE_SHORT_ID',
    // 'topic-16-secondary-research.html': 'PASTE_SHORT_ID',
    // 'topic-17-understanding-media-codes.html': 'PASTE_SHORT_ID',
    // 'topic-18-camera-and-lighting.html': 'PASTE_SHORT_ID',
    // 'topic-19-mise-en-scene-audio-animation.html': 'PASTE_SHORT_ID',
    // 'topic-20-movement-transitions-interactivity.html': 'PASTE_SHORT_ID',
    // 'topic-21-colour-graphics-typography.html': 'PASTE_SHORT_ID',
    // 'topic-22-components-of-work-plans.html': 'PASTE_SHORT_ID',
    // 'topic-23-mind-maps-mood-boards.html': 'PASTE_SHORT_ID',
    // 'topic-24-asset-logs-flow-charts-scripts.html': 'PASTE_SHORT_ID',
    // 'topic-25-storyboards-visualisations-wireframes.html': 'PASTE_SHORT_ID',
    // 'topic-26-legal-considerations-protect-individuals.html': 'PASTE_SHORT_ID',
    // 'topic-27-intellectual-property-rights.html': 'PASTE_SHORT_ID',
    // 'topic-28-regulation-certification-classification.html': 'PASTE_SHORT_ID',
    // 'topic-29-health-and-safety.html': 'PASTE_SHORT_ID',
    // 'topic-30-distribution-platforms-media.html': 'PASTE_SHORT_ID',
    // 'topic-31-file-compression.html': 'PASTE_SHORT_ID',
    // 'topic-32-image-files.html': 'PASTE_SHORT_ID',
    // 'topic-33-audio-files.html': 'PASTE_SHORT_ID',
    // 'topic-34-moving-image-files.html': 'PASTE_SHORT_ID',
    // 'topic-35-hardware-and-software.html': 'PASTE_SHORT_ID',
    // 'topic-36-flow-charts.html': 'PASTE_SHORT_ID',
  };

  var page = (location.pathname.split('/').pop() || '').toLowerCase();
  var id = SHORTS[page];
  if (!id || id === 'PASTE_SHORT_ID' || !/^[A-Za-z0-9_-]{6,20}$/.test(id)) return;

  function build() {
    // Sit directly above the Video Overview / Podcast section (fall back to under the banner).
    var media = document.querySelector('.revision-media');
    var hero = document.querySelector('.hero-band');
    if ((!media && !hero) || document.querySelector('.topic-short')) return;

    if (!document.getElementById('topicShortsCss')) {
      var css = document.createElement('style');
      css.id = 'topicShortsCss';
      css.textContent =
        '.topic-short-wrap{display:flex;gap:28px;align-items:center;flex-wrap:wrap}' +
        '.topic-short-copy{flex:1 1 260px;min-width:0}' +
        '.topic-short-copy h2{margin-top:0}' +
        '.topic-short-badge{display:inline-block;margin-bottom:10px;padding:3px 10px;border-radius:999px;background:var(--course-soft,#f0f7ce);color:var(--course-ink,#364512);font-size:.8rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase}' +
        '.topic-short-frame{flex:0 0 auto;width:min(300px,100%);aspect-ratio:9/16;border-radius:16px;overflow:hidden;background:#202322;box-shadow:0 6px 16px rgba(0,0,0,.18)}' +
        '.topic-short-frame iframe{display:block;width:100%;height:100%;border:0}' +
        '@media (max-width:640px){.topic-short-wrap{justify-content:center}.topic-short-frame{width:min(280px,100%)}}';
      document.head.appendChild(css);
    }

    var watch = 'https://www.youtube.com/shorts/' + id;
    var section = document.createElement('section');
    section.className = 'topic-section topic-short';
    section.innerHTML =
      '<div class="topic-short-wrap">' +
        '<div class="topic-short-copy">' +
          '<span class="topic-short-badge">YouTube Short</span>' +
          '<h2>Quick Revision Short</h2>' +
          '<p>Short on time? Start with this quick recap of the key points, then watch the full video or listen to the podcast below to go deeper.</p>' +
          '<p class="video-note">Prefer the YouTube app? <a href="' + watch + '" rel="noopener" target="_blank">Watch this Short on YouTube</a>.</p>' +
        '</div>' +
        '<div class="topic-short-frame">' +
          '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?rel=0" title="Quick revision Short on YouTube" loading="lazy"' +
          ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"' +
          ' referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>' +
        '</div>' +
      '</div>';
    if (media) media.insertAdjacentElement('beforebegin', section);
    else hero.insertAdjacentElement('afterend', section);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
