const { Schema } = require('mongoose');

module.exports.name = 'Error';

module.exports.schema = new Schema({
  shopId: Schema.Types.ObjectId,
  path: String,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  count: { type: Number, default: 1 },
});
