const response = require('@pixelter/sls-response-helper');
const connectDb = require('../../db/connect');
const shopifyHelpers = require('./helpers');

module.exports.handle = async event => {
  const queryParams = event.queryStringParameters;
  const { shop, hmac, code, state } = queryParams;

  if (shop && hmac && code && state) {
    const databse = await connectDb();
    const isValidRequest = await shopifyHelpers.verifyRequest(
      shop,
      state,
      hmac,
      queryParams,
      databse
    );

    if (isValidRequest) {
      const { haveToken, tokenHash } = await shopifyHelpers.getAccessToken(
        shop,
        code,
        state,
        databse
      );

      if (haveToken) {
        const appUrl = shopifyHelpers.getAppRedirectUrl(shop, tokenHash);
        return response.redirectResponse(appUrl);
      }
    }

    await databse.close();
  }

  return response.createResponse('Installation failed. Please try again :(');
};
