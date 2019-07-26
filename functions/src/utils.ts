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

// A middleware wrapper that always calls the next middleware, either when the
// wrapped middleware calls next or when it just returns.
export function alwaysNextMiddleware(
  mw: Express.RequestHandler,
): Express.RequestHandler {
  return async (req, res, next) => {
    await new Promise(resolve => {
      mw(req, res, resolve);
      resolve();
    });
    next();
  };
}

// A middleware wrapper that handles potentially thrown errors in async middlewares
// by calling next.
export function asyncMiddleware(
  mw: Express.RequestHandler,
): Express.RequestHandler {
  return (req, res, next) => {
    Promise.resolve(mw(req, res, next)).catch(next);
  };
}

// A middleware wrapper that catches errors and sends them as a HTTP 500.
export function catchMiddleware(
  mw: Express.RequestHandler,
): Express.RequestHandler {
  return (req, res, next) => {
    mw(req, res, next).catch((err: Error) => {
      res.statusCode = 500;
      res.send(err.message);
    });
  };
}

export function runMiddleware(
  mw: Express.RequestHandler,
  req: Express.Request,
  res: Express.Response,
) {
  return new Promise(resolve => {
    mw(req, res, resolve);
  });
}
