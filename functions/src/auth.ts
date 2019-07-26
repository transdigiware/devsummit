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

import { unsetSessionCookie, setSessionCookie } from './session.js';
import { Context, UserBlob } from './types.js';
import { BackendOptions } from './backend.js';
import { runMiddleware } from './utils.js';

export default function AuthApp(options: BackendOptions) {
  const app = Express();

  app.use('/:service/login', async (req, res, next) => {
    const serviceName = req.params.service;
    if (!options.authOpts[serviceName]) {
      res.statusCode = StatusCode.BAD_REQUEST;
      res.send('Unknown authentication provider');
      return;
    }
    await runMiddleware(
      Passport.authenticate(serviceName, options.authOpts[serviceName]),
      req,
      res,
    );
    next();
  });

  app.use('/:service/callback', async (req, res, next) => {
    const serviceName = req.params.service;
    if (!options.authOpts[serviceName]) {
      res.statusCode = StatusCode.BAD_REQUEST;
      res.send('Unknown authentication provider');
      return;
    }
    await runMiddleware(Passport.authenticate(serviceName), req, res);

    const userBlob = req.user as UserBlob;
    const context = res.locals as Context;
    context.userId = userBlob.uid;
    await options.storeUserBlob(userBlob);
    setSessionCookie(req, res, options);

    // This logs out Passport’s session.
    // We have our own session management.
    req.logout();
    res.redirect(StatusCode.TEMPORARY_REDIRECT, '/');
  });

  app.use('/logout', (req, res, next) => {
    unsetSessionCookie(req, res, options);
    res.redirect(StatusCode.TEMPORARY_REDIRECT, '/');
  });

  return app;
}

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
