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

import { Context } from './types.js';
import { asyncMiddleware, alwaysNextMiddleware } from './utils.js';
import { BackendOptions } from './backend.js';

export interface CookieValue {
  userId: string;
  // Expiry date as a timestamp
  expires: number;
}

export default function SessionMiddleware(options: BackendOptions) {
  return alwaysNextMiddleware(
    asyncMiddleware(async (req: Express.Request, res: Express.Response) => {
      await new Promise(resolve =>
        cookieParser(options.cookieSecret)(req, res, resolve),
      );
      const { userId, expires } = req.signedCookies[options.cookieName];
      if (new Date().getTime() > expires) {
        return;
      }
      const context = res.locals as Context;
      context.userId = userId;
    }),
  );
}

export function setSessionCookie(
  req: Express.Request,
  res: Express.Response,
  options: BackendOptions,
) {
  const context = res.locals as Context;
  const cookieValue = {
    userId: context.userId,
    expires: new Date().getTime() + options.sessionLength * 1000,
  };

  res.cookie(options.cookieName, cookieValue, {
    httpOnly: true,
    maxAge: options.sessionLength * 1000,
    signed: true,
  });
}

export function unsetSessionCookie(
  req: Express.Request,
  res: Express.Response,
  options: BackendOptions,
) {
  res.clearCookie(options.cookieName, { signed: true, httpOnly: true });
}
