/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const _ = require('lodash');
const async = require('async');
const connectDb = require('../../../db/connect');
const scheduledEventModel = require('../../../db/models/scheduledEvent');
const eventHandler = require('./handlers');
const shopifyHelpers = require('../../shopify/helpers');
// eslint-disable-next-line import/no-unresolved
const { captureError } = require('../../../../serverless_sdk');

/**
 * Settings
 */
const ASYNC_LIMIT = 5;

/**
 * Handle Scheduled Events
 */
module.exports.handle = async () => {
  const db = await connectDb();

  const ScheduledEvent = db.model(scheduledEventModel.name);
  const allEvents = await ScheduledEvent.find({ finished: false });
  const eventsByShop = _.groupBy(allEvents, 'shopId');

  // Handle specific number of shopify stores at once
  await async.eachLimit(
    Object.keys(eventsByShop),
    ASYNC_LIMIT,
    async shopId => {
      const shopEvents = eventsByShop[shopId];
      const shopifyConnection = await shopifyHelpers.getConnection(shopId, db);

      for (const event of shopEvents) {
        try {
          await eventHandler(event, shopifyConnection, db);
          await ScheduledEvent.findOneAndUpdate(
            { _id: event._id },
            { finished: true }
          );
        } catch (err) {
          captureError(err);
        }
      }
    }
  );

  await db.close();
};
