/*
 * Copyright 2018 Google LLC. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

function pad(x) {
  return x < 10 ? `0${x}` : '' + x;
}

function upgrade(raw) {
  if (raw instanceof Date) {
    return raw;
  }
  return new Date(raw);
}

export function date(raw) {
  // TODO(samthor): Use Intl.DateTime methods, if available.
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const d = upgrade(raw);
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${day(d)}`;
}

export function time(raw) {
  const d = upgrade(raw);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function day(raw) {
  const dateEnding = ['st', 'nd', 'rd', 'th'];

  const d = upgrade(raw);
  return `${d.getDate()}${dateEnding[Math.min(d.getDate(), 3)]}`;
}
