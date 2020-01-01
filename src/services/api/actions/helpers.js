const response = require('@pixelter/sls-response-helper');
const scheduledEventModel = require('../../../db/models/scheduledEvent');

/**
 * Listing
 */
module.exports.list = async (
  Model,
  page,
  pageLimit,
  shopId,
  filters = {},
  sort = ''
) => {
  const skip = pageLimit * (page - 1);
  const count = await Model.countDocuments({ ...filters, shopId });
  const items = await Model.find({ ...filters, shopId }, null, {
    limit: pageLimit,
    skip,
  }).sort(sort);
  return response.createJsonResponse(true, { count, items });
};

/**
 * Create
 */
module.exports.create = async (Model, data, shopId) => {
  const newItem = new Model({ shopId, ...data });
  await newItem.save();
  return newItem;
};

/**
 * Update
 */
module.exports.update = async (Model, _id, data, shopId) => {
  const updatedItem = await Model.findOneAndUpdate({ _id, shopId }, data, {
    new: true,
  });

  return updatedItem;
};

/**
 * Remove
 */
module.exports.remove = async (Model, _id, shopId) => {
  const removedItem = await Model.findOneAndRemove({ _id, shopId });
  return removedItem;
};

/**
 * Create Scheduled Event
 */
module.exports.createScheduledEvent = async (
  shopId,
  resource,
  action,
  id,
  db
) => {
  const ScheduledEvent = db.model(scheduledEventModel.name);
  const newEvent = ScheduledEvent({
    shopId,
    resource,
    action,
    resourceId: id,
  });
  await newEvent.save();
};
