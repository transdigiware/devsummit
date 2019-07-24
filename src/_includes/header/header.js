import { render, html } from 'lit-html';
// import {until} from "lit-html/directives/until";

import { onLoginStateChange, login, logout } from '../firebase-auth/auth';
import loginBtnClass from 'classname:_includes/header/style.css:login-btn';

const loginEl = document.querySelector('#login');

onLoginStateChange(user => {
  // Logged out
  if (!user) {
    render(
      html`
        <button
          class=${loginBtnClass}
          @click=${() => {
            console.log('LOGIN');
            login();
          }}
        >
          Login
        </button>
      `,
      loginEl,
    );
    return;
  }

  render(
    html`
      ${user.displayName} <img src="${user.photoURL}" />
      <button @click=${() => logout()}>Log out</button>
    `,
    loginEl,
  );
});
