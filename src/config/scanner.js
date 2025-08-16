export const scannerConfig = {
  maxConcurrentScans: 10,
  defaultTimeout: 30000,
  retryAttempts: 3,
  threatIntelFeeds: [
    'misp',
    'opencti',
    'custom'
  ]
};
