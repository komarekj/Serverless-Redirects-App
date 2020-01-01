const redirectEventHandler = require('./redirectEvent');
const { resources } = require('../../../../db/models/scheduledEvent');

const handlers = {
  [resources.redirect]: redirectEventHandler,
};

module.exports = async (event, shopifyConnection, db) => {
  const handler = handlers[event.resource];
  if (handler) {
    const action = handler[event.action];
    if (action) {
      action(event, shopifyConnection, db);
    } else {
      throw new Error(`Missing action event handler [${event.action}]`);
    }
  } else {
    throw new Error(`Missing resource event handler [${event.resource}]`);
  }
};
