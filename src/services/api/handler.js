const response = require('@pixelter/sls-response-helper');
const _ = require('lodash');
const connectDb = require('../../db/connect');
const apiActions = require('./actions');
const apiHelpers = require('./helpers');

/**
 * API hanlder
 */
module.exports.handle = async event => {
  const databse = await connectDb();

  const { resource, action } = event.pathParameters;
  const data = JSON.parse(event.body);

  const { tokenHash, ...requestData } = data;

  const actionHandler = _.get(apiActions, `${resource}.${action}`);
  let actionResponse;

  if (actionHandler) {
    const shopId = await apiHelpers.getShopId(tokenHash, databse);

    if (shopId) {
      actionResponse = await actionHandler(requestData, shopId, databse);
    } else {
      // Not valid token hash
      actionResponse = response.createJsonResponse(
        false,
        { msg: 'auth failed' },
        401
      );
    }
  } else {
    // No action found
    actionResponse = response.createJsonResponse(
      false,
      { msg: "action doesn't exist" },
      404
    );
  }

  await databse.close();
  return actionResponse;
};
