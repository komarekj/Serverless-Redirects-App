/* eslint-disable no-underscore-dangle */
const response = require('@pixelter/sls-response-helper');
const actionHelper = require('./helpers');
const errorModel = require('../../../db/models/error');
const errorHitModel = require('../../../db/models/errorHit');

/**
 * Settings
 */
const PAGE_LIMIT = 100;

/**
 * Listing
 */
const list = async (data, shopId, db) => {
  const { page = 1 } = data;
  const Error = db.model(errorModel.name);
  return actionHelper.list(
    Error,
    page,
    PAGE_LIMIT,
    shopId,
    null,
    'field -updated'
  );
};

/**
 * Create
 */
const create = async (data, shopId, db) => {
  const { path } = data;

  const Error = db.model(errorModel.name);
  const ErrorHit = db.model(errorHitModel.name);
  const existingError = await Error.findOne({ shopId, path });
  let errorId;

  if (existingError) {
    errorId = existingError._id;
    existingError.count += 1;
    existingError.updated = Date.now();
    await existingError.save();
  } else {
    const newError = await actionHelper.create(Error, data, shopId);
    errorId = newError._id;
  }

  const newHit = new ErrorHit({ shopId, errorId });
  await newHit.save();

  return response.createJsonResponse(true);
};

module.exports = {
  list,
  create,
};
