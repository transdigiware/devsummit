import { render, html } from 'lit-html';
// import {until} from "lit-html/directives/until";

import { onLoginStateChange, login, logout } from '../firebase-auth/auth';
import loginBtnClass from 'classname:_includes/header/style.css:login-btn';
import avatarClass from 'classname:_includes/header/style.css:avatar';

const loginEl = document.querySelector('#login');

onLoginStateChange(user => {
  // Logged out
  if (!user) {
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
        src="${user.photoURL}"
        class=${avatarClass}
        alt=${`Logged in as ${user.displayName}`}
        @click=${logout}
      />
    `,
    loginEl,
  );
});
