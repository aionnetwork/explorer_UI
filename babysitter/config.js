const moment = require('moment');
const ms = require('ms');

module.exports.POLLING_INTERVAL = ms('5m');
module.exports.LATCH_RESET_INTERVAL = moment.duration(15, 'minutes');
