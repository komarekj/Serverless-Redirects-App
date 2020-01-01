const { Schema } = require('mongoose');

module.exports.name = 'Redirect';

module.exports.types = {
  SIMPLE: 'REDIRECT_SIMPLE',
  DYNAMIC: 'REDIRECT_DYNAMIC',
};

module.exports.schema = new Schema({
  shopId: Schema.Types.ObjectId,
  created: { type: Date, default: Date.now },
  redirectType: String,
  path: String,
  target: String,
  generated: Boolean,
  shopifyId: String,
  needsSync: { type: Boolean, default: true },
});
