import { get as getOption, set as setOption, onChange } from './option';

export function enhance(form) {
  const [venue, local] = form.querySelectorAll('[name=timezone]');

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
