const unindent = require('./unindent');

function timestampToCalDate(timestamp) {
  const date = new Date(timestamp).toISOString();
  return date
    .replace(/[:-]/g, '') // Remove delimiters
    .replace(/\.[0-9]*Z$/, 'Z'); // Remove milliseconds
}

module.exports = function({ name, start, end }) {
  return unindent(`
    BEGIN:VCALENDAR
    VERSION:2.0
    PRODID:-//hacksw/handcal//NONSGML v1.0//EN
    BEGIN:VEVENT
    DTSTART:${timestampToCalDate(start)}
    DTEND:${timestampToCalDate(end)}
    SUMMARY:${name}
    END:VEVENT
    END:VCALENDAR
  `);
};
