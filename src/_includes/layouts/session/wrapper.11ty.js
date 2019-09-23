const fsp = require('fs').promises;
const path = require('path');

const icalGenerator = require('../../../utils/ical-generator');

module.exports = class {
  async render(data) {
    const ics = icalGenerator({
      name: `${data.title} - ${data.conf.conferenceName}`,
      start: data.start,
      end: data.end,
    });
    const dir = path.join(process.cwd(), path.dirname(data.page.outputPath));
    await fsp.mkdir(dir, { recursive: true });
    await fsp.writeFile(path.join(dir, 'cal.ics'), ics, 'utf-8');
    return data.content;
  }
  data() {
    return {};
  }
};
