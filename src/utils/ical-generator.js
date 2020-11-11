const unindent = require('./unindent');

function timestampToCalDate(timestamp) {
  const date = new Date(timestamp).toISOString();
  return date
    .replace(/[:-]/g, '') // Remove delimiters
    .replace(/\.[0-9]*Z$/, 'Z'); // Remove milliseconds
}

module.exports = function(calendarName, events) {
  return unindent(`
    BEGIN:VCALENDAR
    VERSION:2.0
    PRODID:-//hacksw/handcal//NONSGML v1.0//EN
    X-WR-CALNAME:${calendarName}
    ${events
      .map(({ name, start, end, location }, idx) => {
        const dtstart = timestampToCalDate(start);
        const dtend = timestampToCalDate(end);
        return unindent(`
          BEGIN:VEVENT
          DTSTAMP:${timestampToCalDate(0)}
          LOCATION:${location}
          URL;VALUE=URI:${location}
          DTSTART:${dtstart}
          DTEND:${dtend}
          SUMMARY:${name}
          UID:${dtstart}-${dtend}-${idx}@google.com
          END:VEVENT
        `);
      })
      .join('\n')}
    END:VCALENDAR
  `)
    .split('\n')
    .join('\r\n');
};
