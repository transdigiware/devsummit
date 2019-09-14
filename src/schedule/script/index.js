import createSchedule from './create-schedule';
import * as styles from 'classnames:schedule/style.css';
import { utcOffset } from 'confbox-config:';

document.querySelector('.' + styles.scheduleBlock).innerHTML = createSchedule(
  self.schedule,
  utcOffset,
  styles,
);
