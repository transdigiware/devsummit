import { render, html } from 'lit-html';

import { getUserData, login, logout } from '../firebase-auth/auth';
import loginBtnClass from 'classname:_includes/header/style.css:login-btn';
import avatarClass from 'classname:_includes/header/style.css:avatar';

async function run() {
  const loginEl = document.querySelector('#login');
  const userData = await getUserData();
  if (!userData) {
    render(
      html`
        <button class=${loginBtnClass} @click=${login}></button>
      `,
      loginEl,
    );
    return;
  }

  render(
    html`
      <img
        src="${userData.picture}"
        class=${avatarClass}
        alt=${`Logged in as ${userData.name}`}
        @click=${logout}
      />
    `,
    loginEl,
  );
}
run();
