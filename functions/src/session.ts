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
import cookieParser from 'cookie-parser';
import StatusCode from 'http-status-codes';

import { Context } from './types.js';

export interface SessionMiddlewareOptions {
  loggedInOnly: boolean;
}

const sessionMiddlewareDefaultOpts: SessionMiddlewareOptions = {
  loggedInOnly: false,
};
export default function sessionMiddleware(
  userOpts: Partial<SessionMiddlewareOptions> = {},
) {
  const opts = Object.assign({}, sessionMiddlewareDefaultOpts, userOpts);

  return async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction,
  ) => {
    const context = res.locals as Context;
    await new Promise(resolve =>
      cookieParser(context.cookieSecret)(req, res, resolve),
    );
    const userId = req.signedCookies[context.cookieName];
    if (userId) {
      context.userId = userId;
    }
    if (opts.loggedInOnly && !userId) {
      res.statusCode = StatusCode.FORBIDDEN;
      res.send('Must be logged in');
      return;
    }
    next();
  };
}
