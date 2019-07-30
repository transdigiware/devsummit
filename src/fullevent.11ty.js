icalGenerator = require('./utils/ical-generator');

module.exports = class iCal {
  data() {
    return {
      permalink: 'fullevent.ics',
    };
  }

  render({ conf }) {
    return icalGenerator({
      name: conf.conferenceName,
      start: conf.start,
      end: conf.end,
    });
  }
};
