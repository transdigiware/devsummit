/**
 *
 * Copyright 2018 Google Inc. All rights reserved.
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

import url from 'url';

import Express from 'express';
import cookieParser from 'cookie-parser';
import querystring from 'querystring';
import { OAuth2Client } from 'google-auth-library';
import StatusCode from 'http-status-codes';

import { UserBlob, Context } from './types.js';

export interface SessionMiddlewareOptions {
  loggedInOnly: boolean;
}

const sessionMiddlewareDefaultOpts: SessionMiddlewareOptions = {
  loggedInOnly: false,
};
export function sessionMiddleware(
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

function oauthClientFactory(context: Context) {
  const [clientId, clientSecret, callback] = context.oauthCredentials;
  return new OAuth2Client(clientId, clientSecret, callback);
}

function login(req: Express.Request, res: Express.Response) {
  const context = res.locals as Context;
  const authUrl = oauthClientFactory(context).generateAuthUrl({
    scope: ['openid', 'email', 'profile'],
    state: '',
  });

  res.redirect(StatusCode.TEMPORARY_REDIRECT, authUrl);
}

function logout(req: Express.Request, res: Express.Response) {
  const context = res.locals as Context;
  res.clearCookie(context.cookieName, { signed: true, httpOnly: true });
  res.redirect('/');
}

async function oauth2callback(req: Express.Request, res: Express.Response) {
  const context = res.locals as Context;

  const oauthClient = oauthClientFactory(context);
  const parsedUrl = url.parse(req.url);
  if (!parsedUrl.query) {
    res.statusCode = StatusCode.BAD_REQUEST;
    res.send('No query part in URL');
    return;
  }
  const qs = querystring.parse(parsedUrl.query);
  if (!qs.code) {
    res.statusCode = StatusCode.BAD_REQUEST;
    res.send('No code present');
    return;
  }
  let code = qs.code;
  // FIXME: This might not be the best way to handle this.
  if (Array.isArray(code)) {
    code = code[0];
  }
  const r = await oauthClient.getToken(code);
  oauthClient.setCredentials(r.tokens);

  if (!r.tokens.id_token) {
    res.statusCode = StatusCode.UNAUTHORIZED;
    res.send('Authorization failed');
    return;
  }
  const loginData = await oauthClient.verifyIdToken({
    idToken: r.tokens.id_token,
  } as any);
  if (!loginData) {
    res.statusCode = StatusCode.UNAUTHORIZED;
    res.send('Couldn’t obtain user data');
    return;
  }
  const loginPayload = loginData.getPayload();

  if (!loginPayload) {
    res.statusCode = StatusCode.UNAUTHORIZED;
    res.send('No ID in user account');
    return;
  }

  const user: UserBlob = {
    email: loginPayload.email || '',
    name: loginPayload.name || '',
    picture: (loginPayload.picture || '').replace(/\/s96-c\/.*$/, '/s512-c/'),
    uid: loginPayload.sub,
  };
  context.storeUserBlob(user);

  res.cookie(context.cookieName, user.uid, {
    httpOnly: true,
    maxAge: context.sessionLength * 1000,
    signed: true,
  });
  res.redirect(StatusCode.TEMPORARY_REDIRECT, '/');
}

const authApp = Express();

authApp.use(sessionMiddleware());
authApp.get('/login', login);
authApp.get('/oauth2callback', oauth2callback);
authApp.get('/logout', logout);

export default authApp;
