/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const _ = require('lodash');
const async = require('async');
const connectDb = require('../../../db/connect');
const redirectModel = require('../../../db/models/redirect');
const scheduledEventModel = require('../../../db/models/scheduledEvent');
const shopifyRedirects = require('../../shopify/redirects');
const shopifyHelpers = require('../../shopify/helpers');
// eslint-disable-next-line import/no-unresolved
const { captureError } = require('../../../../serverless_sdk');

/**
 * Settings
 */
const ASYNC_LIMIT = 5;

/**
 * Simple Redirect Hanlder
 */
const handleSimpleRedirect = async (redirect, Redirect, shopify) => {
  const newRedirect = await shopifyRedirects.sync(redirect, shopify);

  await Redirect.findOneAndUpdate(
    { _id: redirect._id },
    {
      needsSync: false,
      shopifyId: newRedirect.id,
    }
  );
};

/**
 * Dynamic Redirect Hanlder
 */
const handleDynamicRedirect = async (redirect, Redirect, db) => {
  const { shopId } = redirect;

  const ScheduledEvent = db.model(scheduledEventModel.name);
  const newEvent = ScheduledEvent({
    shopId,
    resource: scheduledEventModel.resources.redirect,
    action: scheduledEventModel.actions.generate,
  });
  await newEvent.save();

  await Redirect.findOneAndUpdate({ _id: redirect._id }, { needsSync: false });
};

/**
 * Handle Redirect Sync
 */
module.exports.handle = async () => {
  const db = await connectDb();
  const Redirect = db.model(redirectModel.name);
  const redirects = await Redirect.find({ needsSync: true });
  const redirectsByShop = _.groupBy(redirects, 'shopId');

  // Handle specific number of shopify stores at once
  await async.eachLimit(
    Object.keys(redirectsByShop),
    ASYNC_LIMIT,
    async shopId => {
      try {
        const shopRedirects = redirectsByShop[shopId];
        const shopifyConnection = await shopifyHelpers.getConnection(
          shopId,
          db
        );
        let generateEventCreated = false;

        // Handle sync for each redirect
        for (const redirect of shopRedirects) {
          try {
            const { redirectType } = redirect;

            // Update shopify for simple redirects
            if (redirectType === redirectModel.types.SIMPLE) {
              await handleSimpleRedirect(redirect, Redirect, shopifyConnection);
            }

            // Schedule dynamic redirect rule update
            if (
              redirectType === redirectModel.types.DYNAMIC &&
              !generateEventCreated
            ) {
              await handleDynamicRedirect(redirect, Redirect, db);

              // Create just once per sync cycle
              generateEventCreated = true;
            }
          } catch (err) {
            captureError(err);
          }
        }
      } catch (err) {
        captureError(err);
      }
    }
  );

  await db.close();
};
