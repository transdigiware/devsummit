module.exports = {
  /**
   * Origin of the conference, for creating absolute URLs.
   */
  origin: 'https://developer.chrome.com',
  /**
   * Path of the site. / if it's top-level.
   */
  path: '/devsummit/',
  /**
   * Name of the conference.
   */
  conferenceName: 'Chrome Dev Summit 2020',
  teaser:
    "Join the Chrome team for our two-day summit to learn about the latest techniques for building for the modern Web, get an early insight into what we're working on, and to share your thoughts on how we can move the platform forward, together.",
  /** Link for registration */
  registerLink:
    'https://events.withgoogle.com/chrome-dev-summit-2020/registrations/new/details/',
  /**
   * Data of the conference venue.
   */
  venue: {},
  /**
   * Conference Twitter account
   */
  twitter: '@ChromiumDev',
  /**
   * Timezone of the conference, in the form [+-]HHMM.
   * Examples: -0700, +0100, +0530
   */
  timezone: '-0800',
  /**
   * Start of conference in the above timezone, in the format: YYYY/MM/DD HH:mm.
   */
  start: '2020/12/09 09:00',
  /**
   * Start of conference in the above timezone, in the format: YYYY/MM/DD HH:mm.
   */
  end: '2020/12/10 23:59',
  /**
   * Additional schedule items. These are merged with the content in /sessions/.
   */
  extraSchedule: [
    // breaks
    ...[
      // day, start time, end time
      ['09', '10:25', '10:30'],
      ['09', '11:10', '11:15'],
      ['09', '11:35', '11:40'],
      ['10', '10:10', '10:15'],
      ['10', '10:55', '11:00'],
      ['10', '11:20', '11:25'],
    ].map(([day, startTime, endTime]) => ({
      title: 'Interlude',
      start: `2020/12/${day} ${startTime}`,
      end: `2020/12/${day} ${endTime}`,
      icon: '/schedule/assets/coffee.svg',
      livestreamed: true,
    })),
    {
      title: 'Day 1 complete!',
      start: '2020/12/09 12:30',
      end: '2020/12/09 12:31',
    },
    {
      title: `It's over 😢`,
      start: '2020/12/10 12:00',
      end: '2020/12/10 12:01',
    },
  ],
};
