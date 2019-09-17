import createSchedule from './create-schedule';
import * as styles from 'classnames:schedule/style.css';
import { utcOffset, path } from 'confbox-config:';

document.querySelector('.' + styles.scheduleBlock).innerHTML = createSchedule(
  self.schedule,
  utcOffset,
  styles,
  path,
);
