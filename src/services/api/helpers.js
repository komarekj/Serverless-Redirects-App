const authModel = require('../../db/models/auth');

module.exports.getShopId = async (tokenHash, db) => {
  if (tokenHash) {
    const Auth = db.model(authModel.name);
    const auth = await Auth.findOne({ tokenHash });
    if (auth) return auth.shopId;
  }

  return null;
};
