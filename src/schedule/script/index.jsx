import { h, render } from 'preact';

import Schedule from './schedule.jsx';
import { scheduleBlock } from 'classnames:schedule/style.css';

render(
  <Schedule items={self.schedule} utcOffset={self.confUtcOffset} />,
  document.querySelector('.' + scheduleBlock),
);
