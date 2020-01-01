const { Schema } = require('mongoose');

module.exports.name = 'Dashboard';

module.exports.schema = new Schema({
  shopId: Schema.Types.ObjectId,
});
