icalGenerator = require('./utils/ical-generator');

module.exports = class iCal {
  data() {
    return {
      permalink: 'fullevent.ics',
    };
  }

  render({ conf, collections }) {
    return icalGenerator(
      conf.conferenceName,
      collections.session.map(session => ({
        name: `${session.data.title} - ${conf.conferenceName}`,
        start: session.data.start,
        end: session.data.end,
      })),
    );
  }
};
