import createSchedule from './create-schedule';
import * as styles from 'classnames:schedule/style.css';
import { utcOffset as venueOffset, path } from 'confbox-config:';
import {
  onChange,
  get as getTimezoneOption,
} from '../../_includes/timezone-toggle/script/option';

const localOffset = new Date().getTimezoneOffset() * 60 * 1000 * -1;

console.log(localOffset);
console.log(venueOffset);

function render() {
  const offset = getTimezoneOption() === 'venue' ? venueOffset : localOffset;

  document.querySelector('.' + styles.scheduleBlock).innerHTML = createSchedule(
    self.schedule,
    offset,
    styles,
    path,
  );
}

onChange(render);

if (getTimezoneOption() !== 'venue') {
  render();
}
