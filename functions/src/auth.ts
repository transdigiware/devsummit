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

import * as Express from 'express';
import * as FbAdmin from 'firebase-admin';
import { OAuth2Client } from 'google-auth-library';

import { UserData } from './types.js';

// This is a weird hack because the Express typings are awful.
// https://github.com/rollup/rollup/issues/670
// tslint:disable-next-line:variable-name
const Express_ = Express;

const url = require('url');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

// DO NOT CHANGE THE COOKIE NAME! It’s the only one firebase allows
// https://firebase.google.com/docs/hosting/functions#using_cookies
const COOKIE_NAME = '__session';

export interface AuthenticatedRequest extends Express.Request {
  userId?: string;
  user?: UserData;
}

export interface AuthAppOptions {
  callback: string;
  cookieSecret: string;
  clientId: string;
  clientSecret: string;
  sessionLengthInSeconds: number;
  loginFilter?: (user: UserData) => boolean;
  userDbFactory: () => FbAdmin.database.Reference;
}

export function AuthApp({
  callback,
  cookieSecret,
  clientId,
  clientSecret,
  loginFilter,
  userDbFactory,
  sessionLengthInSeconds,
}: AuthAppOptions) {
  function oauthClientFactory() {
    return new OAuth2Client(clientId, clientSecret, callback);
  }

  function login(req: Express.Request, res: Express.Response) {
    const authUrl = oauthClientFactory().generateAuthUrl({
      scope: ['openid', 'email', 'profile'],
      state: '',
    });

    res.redirect(301, authUrl);
  }

  async function getUser(req: Express.Request): Promise<UserData | null> {
    const cookieValue = req.signedCookies[COOKIE_NAME];
    if (!cookieValue || cookieValue.length === 0) {
      return null;
    }
    return (await userDbFactory()
      .child(cookieValue)
      .once('value')).val();
  }

  function logout(req: Express.Request, res: Express.Response) {
    res.clearCookie(COOKIE_NAME, { signed: true, httpOnly: true });
    res.redirect('/');
  }

  async function oauth2callback(req: Express.Request, res: Express.Response) {
    const oauthClient = oauthClientFactory();
    const qs = querystring.parse(url.parse(req.url).query);
    const r = await oauthClient.getToken(qs.code);
    oauthClient.setCredentials(r.tokens);

    if (!r.tokens.id_token) {
      res.statusCode = 500;
      res.send('Authorization failed');
      return;
    }
    const loginData = await oauthClient.verifyIdToken({
      idToken: r.tokens.id_token,
    } as any);
    if (!loginData) {
      res.statusCode = 500;
      res.send('Couldn’t obtain user data');
      return;
    }
    const loginPayload = loginData.getPayload();

    if (!loginPayload) {
      res.statusCode = 500;
      res.send('No ID in user account');
      return;
    }

    const user: UserData = {
      email: loginPayload.email || '',
      name: loginPayload.name || '',
      picture: (loginPayload.picture || '').replace(/\/s96-c\/.*$/, '/s512-c/'),
      uid: loginPayload.sub,
    };

    if (loginFilter && !loginFilter(user)) {
      res.statusCode = 403;
      res.send('You are not allowed');
      return;
    }

    const ref = userDbFactory().child(user.uid);
    const oldUser = (await ref.once('value')).val();
    const newUser = Object.assign({}, oldUser, user);
    await ref.set(newUser);

    res.cookie(COOKIE_NAME, user.uid, {
      httpOnly: true,
      maxAge: sessionLengthInSeconds * 1000,
      signed: true,
    });
    res.redirect(301, '/');
  }

  function needsAuthenticatedUser() {
    const router = Express.Router();
    router.use(cookieParser(cookieSecret));
    router.use((async (
      req: AuthenticatedRequest,
      res: Express.Response,
      next: Express.NextFunction,
    ) => {
      const userId = req.signedCookies[COOKIE_NAME];
      if (!userId) {
        res.statusCode = 403;
        res.send('Not logged in.');
        return;
      }
      req.userId = userId;
      next();
    }) as any);
    return router;
  }

  const authApp = Express_();

  authApp.use(cookieParser(cookieSecret));
  authApp.use(
    (
      req: Express.Request,
      res: Express.Response,
      next: Express.NextFunction,
    ) => {
      // This is required for cookie headers to not get stripped.
      // https://bit.ly/2Q2s2cH
      res.setHeader('Cache-Control', 'private');
      next();
    },
  );
  authApp.get('/login', login);
  authApp.get('/oauth2callback', oauth2callback);
  authApp.get('/logout', logout);

  return {
    app: authApp,
    needsAuthenticatedUser,
    getUser,
  };
}
