const Shopify = require('shopify-api-node');

/**
 * Create new redirect
 */
const create = async (redirect, shopify) => {
  const { path, target } = redirect;

  const newRedirect = await shopify.redirect.create({
    path,
    target,
  });

  return newRedirect;
};

/**
 * Update existing redirect
 */
const update = async (redirect, shopify) => {
  const { path, target, shopifyId } = redirect;

  const updatedRedirect = await shopify.redirect.update(shopifyId, {
    path,
    target,
  });

  return updatedRedirect;
};

/**
 * Remove existing redirect
 */
module.exports.remove = async (id, shopify) => {
  await shopify.redirect.delete(id);
};

/**
 * Handle redirect sync
 */
module.exports.sync = async (redirect, shopify) => {
  const { shopifyId } = redirect;

  if (shopifyId) {
    return await update(redirect, shopify);
  } else {
    return await create(redirect, shopify);
  }
};
