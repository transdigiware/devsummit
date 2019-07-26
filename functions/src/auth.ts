/**
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Express from 'express';
import StatusCode from 'http-status-codes';
import Passport from 'passport';

import sessionMiddleware, {
  unsetSessionCookie,
  setSessionCookie,
} from './session.js';
import { Context, UserBlob } from './types.js';

Passport.serializeUser(function(user, done) {
  done(null, user);
});

Passport.deserializeUser(function(user, done) {
  done(null, user);
});

const authApp = Express();

// This is required so we can read/write the signed session cookie.
authApp.use(sessionMiddleware());
authApp.use('/:service/login', (req, res, next) => {
  const context = res.locals as Context;
  const serviceName = req.params.service;
  if (!context.authOpts[serviceName]) {
    res.statusCode = StatusCode.BAD_REQUEST;
    res.send('Unknown authentication provider');
    return;
  }
  Passport.authenticate(serviceName, context.authOpts[serviceName])(
    req,
    res,
    next,
  );
});

authApp.use('/:service/callback', async (req, res, next) => {
  const context = res.locals as Context;
  const serviceName = req.params.service;
  if (!context.authOpts[serviceName]) {
    res.statusCode = StatusCode.BAD_REQUEST;
    res.send('Unknown authentication provider');
    return;
  }
  await new Promise(resolve =>
    Passport.authenticate(serviceName)(req, res, resolve),
  );

  const userBlob = req.user as UserBlob;
  context.userId = userBlob.uid;
  await context.storeUserBlob(userBlob);
  setSessionCookie(req, res);

  // This logs out Passport’s session.
  // We have our own session management.
  req.logout();
  res.redirect(StatusCode.TEMPORARY_REDIRECT, '/');
});

authApp.use('/logout', (req, res, next) => {
  unsetSessionCookie(req, res);
  res.redirect(StatusCode.TEMPORARY_REDIRECT, '/');
});

export default authApp;

export function authenticationRequiredMiddleware() {
  return async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction,
  ) => {
    const context = res.locals as Context;
    if (!context.userId) {
      res.statusCode = StatusCode.FORBIDDEN;
      res.send('Not logged in');
      return;
    }
    next();
  };
}
