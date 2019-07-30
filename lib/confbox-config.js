const date = require('date-and-time');
const config = require('../confbox.config');

// Process config.timezone
const utcOffset = (() => {
  const timezoneRE = /^([+-])(\d\d)(\d\d)$/;
  const result = timezoneRE.exec(config.timezone);
  if (!result) {
    throw new TypeError(
      `Invalid timezone in confbox.config.js. Must be in the format [+-]HHMM. Found: ${config.timezone}`,
    );
  }
  const hours = Number(result[2]);
  const minutes = Number(result[3]);
  let offset = (hours * 60 + minutes) * 60 * 1000;
  if (result[1] === '-') offset *= -1;
  return offset;
})();

// Convert config.start and config.end to timestamps
const [start, end] = [config.start, config.end].map(dateStr => {
  const result = date.parse(dateStr, 'YYYY/MM/DD HH:mm');
  if (isNaN(result)) {
    throw new TypeError(
      `Invalid date in confbox.config.js. Must be in the format YYYY/MM/DD HH:mm'. Found: ${dateStr}`,
    );
  }
  return result.valueOf() - utcOffset;
});

exports.utcOffset = utcOffset;
exports.start = start;
exports.end = end;
exports.conferenceName = config.conferenceName;
