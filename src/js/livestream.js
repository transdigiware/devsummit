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

const ytIframe = document.getElementById('youtube');
ytIframe && setup(ytIframe);

function setup(iframe) {
  const wrap = ytIframe.closest('.youtube-wrap');
  iframe.addEventListener('load', (ev) => {
    // Use a delay to try to trick YouTube into giving us the large preview image. It seems to
    // be decided even after load. We should probably use YT.Player here, but don't want to
    // include more code at this point.
    window.setTimeout(() => {
      wrap.classList.add('load');
    }, 333);
  });

  function embedForTime(now) {
    // nb. This method can be used to control loading of different embed URLs over time.
    // playlist of all videos embed
    return `videoseries?list=PLNYkxOF6rcIDjlCx1PcphPpmf43aKOAdF`;
  }

  function updateSrc() {
    const now = new Date();
    const updatedSrc = 'https://www.youtube.com/embed/' + embedForTime(now);
    if (iframe.src !== updatedSrc) {
      iframe.src = updatedSrc;
    }
  }

  // check every minute
  window.setInterval(updateSrc, 1000 * 60);
  updateSrc();
}