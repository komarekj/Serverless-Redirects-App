const { Schema } = require('mongoose');

module.exports.name = 'ErrorHit';

module.exports.schema = new Schema({
  shopId: Schema.Types.ObjectId,
  errorId: Schema.Types.ObjectId,
  created: { type: Date, default: Date.now },
});
