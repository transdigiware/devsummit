import { render, html } from 'lit-html';

import { onLoginStateChange, login, logout } from '../auth/auth';
import loginBtnClass from 'classname:_includes/header/style.css:login-btn';
import avatarClass from 'classname:_includes/header/style.css:avatar';

function run() {
  const loginEl = document.querySelector('#login');
  onLoginStateChange(userData => {
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
  });
}
run();
