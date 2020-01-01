const aws = require('aws-sdk');
const scheduledEventModel = require('../../../../db/models/scheduledEvent');
const redirectModel = require('../../../../db/models/redirect');
const shopifyRedirects = require('../../../shopify/redirects');

const { S3_BUCKET } = process.env;

/**
 * Remove
 */
const remove = async (event, shopify) =>
  await shopifyRedirects.remove(event.resourceId, shopify);

/**
 * Generate
 */
const generate = async (event, shopify, db) => {
  const { shopId } = event;
  const Redirect = db.model(redirectModel.name);
  const redirects = await Redirect.find({
    shopId,
    redirectType: redirectModel.types.DYNAMIC,
  });

  const redirectRules = redirects.map(({ path, target }) => ({ path, target }));

  const s3 = new aws.S3();

  await s3
    .putObject({
      Bucket: S3_BUCKET,
      Key: `redirect-rules/${shopId}.json`,
      Body: JSON.stringify(redirectRules),
    })
    .promise();
};

module.exports = {
  [scheduledEventModel.actions.remove]: remove,
  [scheduledEventModel.actions.generate]: generate,
};
