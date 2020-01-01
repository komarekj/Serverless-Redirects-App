const { Schema } = require('mongoose');

module.exports.name = 'ScheduledEvent';

module.exports.actions = {
  create: 'CREATE',
  remove: 'REMOVE',
  update: 'UPDATE',
  generate: 'GENERATE',
};

module.exports.resources = {
  redirect: 'REDIRECT',
};

module.exports.schema = new Schema({
  shopId: Schema.Types.ObjectId,
  created: { type: Date, default: Date.now },
  action: String,
  resource: String,
  resourceId: String,
  finished: { type: Boolean, default: false },
});
