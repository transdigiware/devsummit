import { render, html } from 'lit-html';

import { onLoginStateChange, login, logout } from '../auth/auth';
import { avatar, loginBtn } from 'classnames:_includes/header/style.css';

function run() {
  const loginEl = document.querySelector('#login');
  onLoginStateChange(userData => {
    if (!userData) {
      render(
        html`
          <button class=${loginBtn} title="Login" @click=${login} />
        `,
        loginEl,
      );
      return;
    }

    render(
      html`
        <button
          style=${`--avatar: url(${userData.picture})`}
          class=${avatar}
          title=${`Logged in as ${userData.name}. Click to Logout.`}
          @click=${logout}
        />
      `,
      loginEl,
    );
  });
}
run();
