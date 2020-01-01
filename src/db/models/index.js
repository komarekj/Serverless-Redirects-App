const auth = require('./auth');
const dashboard = require('./dashboard');
const error = require('./error');
const errorHit = require('./errorHit');
const redirect = require('./redirect');
const shop = require('./shop');
const scheduledEvent = require('./scheduledEvent');

module.exports = [
  auth,
  dashboard,
  error,
  errorHit,
  redirect,
  shop,
  scheduledEvent,
];
