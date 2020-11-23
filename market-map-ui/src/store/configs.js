export default {
  bing: {
    id: process.env.CARVANA_APP_ANALYTICS_BING_ID
  },
  google: {
    id: process.env.CARVANA_APP_ANALYTICS_GOOGLE_ID
  },
  facebook: {
    id: process.env.CARVANA_APP_ANALYTICS_FACEBOOK_ID
  },
  kinesis: {
    url: process.env.CARVANA_APP_ANALYTICS_KINESIS_EVENT_PUBLISH_URL,
    registeredEvents: [
      { name: 'increment counter', caption: 'Add one to the count!' },
      { name: 'decrement counter', caption: 'Subtract one from the count!' }
    ]
  },
  kissmetrics: {
    id: process.env.CARVANA_APP_KISSMETRICS_KEY
  }
};
