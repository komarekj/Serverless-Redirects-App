const redirectActions = require('./redirectActions');
const errorActions = require('./errorActions');
const dashboardActions = require('./dashboardActions');

module.exports = {
  redirect: redirectActions,
  error: errorActions,
  dashboard: dashboardActions,
};
