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
          <button class=${loginBtnClass} title="Login" @click=${login}></button>
        `,
        loginEl,
      );
      return;
    }

    render(
      html`
        <button
          style=${`--avatar: url(${userData.picture})`}
          class=${avatarClass}
          title=${`Logged in as ${userData.name}. Click to Logout.`}
          @click=${logout}
        />
      `,
      loginEl,
    );
  });
}
run();
