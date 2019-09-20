import {
  get as getOption,
  set as setOption,
  onChange,
  localOffset,
} from './option';
import { utcOffset as venueOffset } from 'confbox-config:';

function formatTimezone(offset) {
  const hours = Math.floor(offset / 1000 / 60 / 60);
  const minutes = (offset / 1000 / 60) % 60;

  return (hours > 0 ? '+' : '') + hours + (minutes ? ':' + minutes : '');
}

export function enhance(form) {
  const [venue, local] = form.querySelectorAll('[name=timezone]');
  const [venueZone, localZone] = form.querySelectorAll('.js-zone');

  venueZone.textContent = formatTimezone(venueOffset);
  localZone.textContent = formatTimezone(localOffset);

  form.addEventListener('change', () => {
    setOption(venue.checked ? 'venue' : 'local');
  });

  function setForm() {
    const timezone = getOption();
    const toCheck = timezone === 'venue' ? venue : local;
    toCheck.checked = true;
  }

  onChange(setForm);
  setForm();
  form.style.visibility = 'visible';
}
