const { months, days, monthsShort } = require('../../../script/date');
const { html } = require('../../../script/escape-html');

module.exports = function createCalendarWidget(
  timestamp,
  utcOffset,
  classNameMap,
) {
  const date = new Date(timestamp + utcOffset);
  const minutes = date.getUTCMinutes();
  const hours = date.getUTCHours();

  const formattedTime =
    (hours % 12 || 12) +
    (minutes ? ':' + minutes.toString().padStart(2, '0') : '') +
    (hours < 12 ? 'am' : 'pm');

  return html`
    <div class="${classNameMap.icon}">
      <span class="${classNameMap.month}"
        >${monthsShort[date.getUTCMonth()]}</span
      >
      <span class="${classNameMap.day}">${date.getUTCDate()}</span>
    </div>
    <div class="${classNameMap.dateContainer}">
      <span class="${classNameMap.weekday}"
        >${days[date.getUTCDay() - 1]},&nbsp;</span
      >
      <span class="${classNameMap.fullDate}"
        >${months[date.getUTCMonth()]} ${date.getUTCDate()}</span
      >
    </div>
    <div class="${classNameMap.time}">${formattedTime}</div>
  `.toString();
  // Nunjucks has bugs with String objects, so we to toString to get a primitive.
};
