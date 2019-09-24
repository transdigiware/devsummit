const date = require('date-and-time');

function dateStrToTimestamp(dateStr, utcOffset) {
  const result = date.parse(dateStr, 'YYYY/MM/DD HH:mm', true);
  if (isNaN(result)) {
    throw new TypeError(
      `Invalid date. Must be in the format YYYY/MM/DD HH:mm'. Found: ${dateStr}`,
    );
  }
  return result.valueOf() - utcOffset;
}

module.exports = { dateStrToTimestamp };
