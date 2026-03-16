window.IMEDIA_ENGAGEMENT_CONFIG = Object.assign({
  siteName: 'imediagenius-static',
  tokenParam: 'engagement',
  storageKey: 'imediaEngagementSession',
  queueKey: 'imediaEngagementQueue',
  verifyEndpoint: 'https://europe-west2-imediagenius.cloudfunctions.net/createEngagementSessionFromToken',
  ingestEndpoint: 'https://europe-west2-imediagenius.cloudfunctions.net/logEngagementEventHttp',
  debug: false,
  heartbeatSeconds: 30,
  maxQueueSize: 150,
  autoTrackButtons: true,
  autoTrackForms: true,
  autoTrackMedia: true
}, window.IMEDIA_ENGAGEMENT_CONFIG || {});
