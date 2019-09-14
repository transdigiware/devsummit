import { h, render } from 'preact';

import Schedule from './schedule.jsx';
import { scheduleBlock } from 'classnames:schedule/style.css';
import { utcOffset } from 'confbox-config:';

render(
  <Schedule items={self.schedule} utcOffset={utcOffset} />,
  document.querySelector('.' + scheduleBlock),
);
