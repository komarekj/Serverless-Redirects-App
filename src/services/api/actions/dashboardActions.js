const response = require('@pixelter/sls-response-helper');
const moment = require('moment');
const MomentRange = require('moment-range');
const redirectModel = require('../../../db/models/redirect');
const errorModel = require('../../../db/models/error');
const errorHitModel = require('../../../db/models/errorHit');

const momentExt = MomentRange.extendMoment(moment);

const get = async (data, shopId, db) => {
  const Redirect = db.model(redirectModel.name);
  const Error = db.model(errorModel.name);
  const ErrorHit = db.model(errorHitModel.name);

  const today = momentExt().startOf('day');
  const monthAgo = momentExt()
    .startOf('day')
    .subtract(1, 'month');

  // Summary data
  const redirectCount = await Redirect.countDocuments({ shopId });
  const errorCountUnique = await Error.countDocuments({ shopId });

  // Error listing
  const lastMonthHits = await ErrorHit.find({
    shopId,
    created: {
      $gte: monthAgo.toDate(),
    },
  });

  const errorsCountLastMonth = lastMonthHits.length;

  const rangeDays = momentExt.range(monthAgo, today).by('day');
  const errorsByDay = [...rangeDays].map(date => {
    const hitsOnDate = lastMonthHits.filter(hit =>
      momentExt(hit.created).isSame(date, 'day')
    );

    return {
      date: date.toDate(),
      count: hitsOnDate.length,
    };
  });

  const summary = {
    redirectCount,
    errorCountUnique,
    errorsCountLastMonth,
  };

  return response.createJsonResponse(true, { summary, errorData: errorsByDay });
};

module.exports = { get };
