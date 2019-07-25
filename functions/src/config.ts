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
import * as Functions from 'firebase-functions';
import * as fbAdmin from 'firebase-admin';
import Express from 'express';

import { Context, UserBlob } from './types.js';

const config = Functions.config();
fbAdmin.initializeApp(
  Object.assign({}, config.firebase, {
    credential: fbAdmin.credential.cert(config.serviceaccount),
    databaseURL: 'https://cds2019-d4673.firebaseio.com/',
  }),
);

const configMiddleware: Express.RequestHandler = (req, res, next) => {
  // This is required for cookie headers to not get stripped
  // when using Firebase functions.
  // https://bit.ly/2Q2s2cH
  res.setHeader('Cache-Control', 'private');

  const context: Context = {
    // The name of the cookie to store the session in.
    // If you are using Firebase functions,
    // DO NOT CHANGE THE COOKIE NAME!
    // It’s the only one firebase allows:
    // https://firebase.google.com/docs/hosting/functions#using_cookies
    cookieName: '__session',
    // Secret to encrypt the session cookie with.
    cookieSecret: 'lol123',
    // Called by other apps to update a user’s blob.
    async storeUserBlob(userBlob: UserBlob) {
      await fbAdmin
        .database()
        .ref('users')
        .child(userBlob.uid)
        .set(userBlob);
    },
    // Called by other apps to get the current user’s blob.
    async getUserBlob(uid: string): Promise<UserBlob | null> {
      const ev = await fbAdmin
        .database()
        .ref('users')
        .child(uid)
        .once('value');

      return ev.val();
    },
    oauthCredentials: [
      config.auth.oauth2id,
      config.auth.oauth2secret,
      'http://localhost:5000/backend/auth/oauth2callback',
    ],
    // Length of a session in seconds
    sessionLength: 24 * 60 * 60,
  };
  Object.assign(res.locals, context);

  next();
};

export default configMiddleware;
