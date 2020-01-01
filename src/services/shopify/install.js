const response = require('@pixelter/sls-response-helper');
const shopifyHelpers = require('./helpers');
const connectDb = require('../../db/connect');

module.exports.url = async event => {
  const data = JSON.parse(event.body);
  const { shopUrl } = data;
  const databse = await connectDb();

  if (shopUrl) {
    const url = await shopifyHelpers.installUrl(shopUrl, databse);
    return response.createJsonResponse(true, { url });
  }

  return response.createJsonResponse(false, { msg: 'missing shop url' });
};
