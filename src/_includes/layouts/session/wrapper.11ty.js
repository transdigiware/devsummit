const fsp = require('fs').promises;
const path = require('path');

const icalGenerator = require('../../../utils/ical-generator');

module.exports = class {
  async render(data) {
    // This function doesn't actually change the content at all.
    // It just uses the render hook to also write out an .ics file.
    const name = `${data.title} - ${data.conf.conferenceName}`;
    const ics = icalGenerator(name, [
      {
        name,
        start: data.start,
        end: data.end,
      },
    ]);
    const dir = path.join(process.cwd(), path.dirname(data.page.outputPath));
    await fsp.mkdir(dir, { recursive: true });
    await fsp.writeFile(path.join(dir, 'cal.ics'), ics, 'utf-8');
    return data.content;
  }
};
