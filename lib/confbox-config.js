const date = require('date-and-time');
const config = require('../confbox.config');

const {
  timezone: configTimezone,
  start: configStart,
  end: configEnd,
  ...configExtra
} = config;

// Process configTimezone
const utcOffset = (() => {
  const timezoneRE = /^([+-])(\d\d)(\d\d)$/;
  const result = timezoneRE.exec(configTimezone);
  if (!result) {
    throw new TypeError(
      `Invalid timezone in confbox.config.js. Must be in the format [+-]HHMM. Found: ${configTimezone}`,
    );
  }
  const hours = Number(result[2]);
  const minutes = Number(result[3]);
  let offset = (hours * 60 + minutes) * 60 * 1000;
  if (result[1] === '-') offset *= -1;
  return offset;
})();

// Convert configStart and configEnd to timestamps
const [start, end] = [configStart, configEnd].map(dateStr => {
  const result = date.parse(dateStr, 'YYYY/MM/DD HH:mm');
  if (isNaN(result)) {
    throw new TypeError(
      `Invalid date in confbox.config.js. Must be in the format YYYY/MM/DD HH:mm'. Found: ${dateStr}`,
    );
  }
  return result.valueOf() - utcOffset;
});

module.exports = {
  utcOffset,
  start,
  end,
  ...configExtra,
};
