/* R093 topic navigation: previous / next topic and a jump menu grouped by spec topic area.
   Adds a compact bar under the page header and a larger "next topic" bar before the footer. */
(function () {
  'use strict';

  var TOPICS = [
    ['topic-01-traditional-media.html', 'Traditional Media'],
    ['topic-02-new-media.html', 'New Media'],
    ['topic-03-video-audio-music.html', 'Video, Audio & Music'],
    ['topic-04-animation-sfx-vfx.html', 'Animation, SFX & VFX'],
    ['topic-05-social-media.html', 'Social Media'],
    ['topic-06-website-assets.html', 'Website Assets'],
    ['topic-07-creative-job-roles.html', 'Creative Job Roles'],
    ['topic-08-technical-job-roles.html', 'Technical Job Roles'],
    ['topic-09-senior-job-roles.html', 'Senior Job Roles'],
    ['topic-10-purpose-of-media-products.html', 'Purpose of Media Products'],
    ['topic-11-client-requirements.html', 'Client Requirements'],
    ['topic-12-client-brief-formats.html', 'Client Brief Formats'],
    ['topic-13-audience-segmentation.html', 'Audience Segmentation'],
    ['topic-14-audience-research.html', 'Audience Research'],
    ['topic-15-primary-research.html', 'Primary Research'],
    ['topic-16-secondary-research.html', 'Secondary Research'],
    ['topic-17-understanding-media-codes.html', 'Understanding Media Codes'],
    ['topic-18-camera-and-lighting.html', 'Camera and Lighting'],
    ['topic-19-mise-en-scene-audio-animation.html', 'Mise-en-scène, Audio & Animation'],
    ['topic-20-movement-transitions-interactivity.html', 'Movement, Transitions & Interactivity'],
    ['topic-21-colour-graphics-typography.html', 'Colour, Graphics & Typography'],
    ['topic-22-components-of-work-plans.html', 'Components of Work Plans'],
    ['topic-23-mind-maps-mood-boards.html', 'Mind Maps & Mood Boards'],
    ['topic-24-asset-logs-flow-charts-scripts.html', 'Asset Logs, Flow Charts & Scripts'],
    ['topic-25-storyboards-visualisations-wireframes.html', 'Storyboards, Visualisations & Wireframes'],
    ['topic-26-legal-considerations-protect-individuals.html', 'Legal Considerations'],
    ['topic-27-intellectual-property-rights.html', 'Intellectual Property Rights'],
    ['topic-28-regulation-certification-classification.html', 'Regulation, Certification & Classification'],
    ['topic-29-health-and-safety.html', 'Health & Safety'],
    ['topic-30-distribution-platforms-media.html', 'Distribution Platforms & Media'],
    ['topic-31-file-compression.html', 'File Compression'],
    ['topic-32-image-files.html', 'Image Files'],
    ['topic-33-audio-files.html', 'Audio Files'],
    ['topic-34-moving-image-files.html', 'Moving Image Files'],
    ['topic-35-hardware-and-software.html', 'Hardware & Software'],
    ['topic-36-flow-charts.html', 'Flow Charts']
  ];
  // Group labels by topic number range (follows the order of the topic pages)
  var GROUPS = [
    [1, 9, 'TA1 · The media industry'],
    [10, 21, 'TA2 · Factors influencing product design'],
    [22, 29, 'TA3 · Pre-production planning'],
    [30, 34, 'TA4 · Distribution considerations'],
    [35, 36, 'TA3 · Planning tools & documents']
  ];

  var page = (location.pathname.split('/').pop() || '').toLowerCase();
  var idx = -1;
  for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i][0] === page) { idx = i; break; }
  if (idx < 0) return;

  function num(i) { return (i + 1 < 10 ? '0' : '') + (i + 1); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function select(id) {
    var html = '<select id="' + id + '" class="tnav-select" aria-label="Jump to an R093 topic">';
    GROUPS.forEach(function (g) {
      html += '<optgroup label="' + esc(g[2]) + '">';
      for (var n = g[0]; n <= g[1]; n++) {
        var t = TOPICS[n - 1];
        html += '<option value="' + t[0] + '"' + (n - 1 === idx ? ' selected' : '') + '>' + num(n - 1) + ' · ' + esc(t[1]) + '</option>';
      }
      html += '</optgroup>';
    });
    return html + '</select>';
  }

  function link(i, dir, big) {
    if (i < 0 || i >= TOPICS.length) return '<span class="tnav-link tnav-empty" aria-hidden="true"></span>';
    var t = TOPICS[i];
    var label = dir === 'prev' ? 'Previous topic' : 'Next topic';
    return '<a class="tnav-link tnav-' + dir + (big ? ' big' : '') + '" href="' + t[0] + '" rel="' + dir + '">' +
      (dir === 'prev' ? '<span class="tnav-arrow" aria-hidden="true">←</span>' : '') +
      '<span class="tnav-text"><span class="tnav-kicker">' + label + '</span><span class="tnav-title">' + num(i) + ' · ' + esc(t[1]) + '</span></span>' +
      (dir === 'next' ? '<span class="tnav-arrow" aria-hidden="true">→</span>' : '') + '</a>';
  }

  function build() {
    if (document.querySelector('.tnav')) return;

    var top = document.createElement('nav');
    top.className = 'tnav tnav-top';
    top.setAttribute('aria-label', 'R093 topic navigation');
    top.innerHTML = link(idx - 1, 'prev') +
      '<div class="tnav-mid"><span class="tnav-count">Topic ' + num(idx) + ' of ' + TOPICS.length + '</span>' + select('tnavSelectTop') +
      '<div class="tnav-progress" aria-hidden="true"><span style="width:' + Math.round((idx + 1) / TOPICS.length * 100) + '%"></span></div></div>' +
      link(idx + 1, 'next');

    var bottom = document.createElement('nav');
    bottom.className = 'tnav tnav-bottom';
    bottom.setAttribute('aria-label', 'Continue to another R093 topic');
    bottom.innerHTML = link(idx - 1, 'prev', true) + link(idx + 1, 'next', true) +
      '<div class="tnav-all"><label for="tnavSelectBottom">Jump to any topic</label>' + select('tnavSelectBottom') +
      '<a class="tnav-home" href="index.html">All R093 topics</a></div>';

    var header = document.querySelector('.topic-header');
    var hero = document.querySelector('.hero-band');
    if (header) header.insertAdjacentElement('afterend', top);
    else if (hero) hero.insertAdjacentElement('beforebegin', top);
    else document.body.prepend(top);

    var footer = document.querySelector('.page > footer') || document.querySelector('footer');
    if (footer) footer.insertAdjacentElement('beforebegin', bottom);
    else document.body.appendChild(bottom);

    Array.prototype.forEach.call(document.querySelectorAll('.tnav-select'), function (s) {
      s.addEventListener('change', function () { if (s.value && s.value !== page) location.href = s.value; });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
