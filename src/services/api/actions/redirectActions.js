/* eslint-disable no-underscore-dangle */
const response = require('@pixelter/sls-response-helper');
const actionHelper = require('./helpers');
const redirectModel = require('../../../db/models/redirect');
const scheduledEventModel = require('../../../db/models/scheduledEvent');

/**
 * Settings
 */
const PAGE_LIMIT = 100;

/**
 * Listing
 */
const list = async (data, shopId, db) => {
  const { redirectType, page = 1 } = data;
  const Redirect = db.model(redirectModel.name);
  return actionHelper.list(Redirect, page, PAGE_LIMIT, shopId, {
    redirectType,
  });
};

/**
 * Create
 */
const create = async (data, shopId, db) => {
  const Redirect = db.model(redirectModel.name);
  const newRedirect = await actionHelper.create(Redirect, data, shopId);

  return response.createJsonResponse(true, newRedirect);
};

/**
 * Update
 */
const update = async (data, shopId, db) => {
  const { _id, ...updateData } = data;
  const Redirect = db.model(redirectModel.name);
  const updatedItem = await actionHelper.update(
    Redirect,
    _id,
    {
      ...updateData,
      needsSync: true,
    },
    shopId
  );

  return response.createJsonResponse(true, updatedItem);
};

/**
 * Remove
 */
const remove = async (data, shopId, db) => {
  const { _id } = data;
  const Redirect = db.model(redirectModel.name);

  const removedRedirect = await actionHelper.remove(Redirect, _id, shopId);

  if (removedRedirect) {
    if (removedRedirect.shopifyId) {
      await actionHelper.createScheduledEvent(
        shopId,
        scheduledEventModel.resources.redirect,
        scheduledEventModel.actions.remove,
        removedRedirect.shopifyId,
        db
      );
    }

    return response.createJsonResponse(true);
  }

  return response.createJsonResponse(false);
};

module.exports = {
  list,
  create,
  update,
  remove,
};
