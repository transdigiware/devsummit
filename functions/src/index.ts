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

import Passport from 'passport';
// @ts-ignore
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// @ts-ignore
import { Strategy as GitHubStrategy } from 'passport-github';

// `rootRouter` is an Express app that contains the entire backend app.
import Backend, { BackendOptions } from './backend.js';

// We are using Firebase functions.
import * as Functions from 'firebase-functions';
import * as fbAdmin from 'firebase-admin';

import { UserBlob } from './types.js';

// This initializes Firebase and gets our secrets via Firebase’s
// config API.
const config = Functions.config();
fbAdmin.initializeApp(
  Object.assign({}, config.firebase, {
    credential: fbAdmin.credential.cert(config.serviceaccount),
    databaseURL: 'https://cds2019-d4673.firebaseio.com/',
  }),
);

Passport.serializeUser(function(user, done) {
  done(null, user);
});

Passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Register all your Passport strategies here.
// Use the callback to populate the UserBlob.
Passport.use(
  new GoogleStrategy(
    {
      clientID: config.auth.google.id,
      clientSecret: config.auth.google.secret,
      callbackURL: `${process.env.HOST || ''}/backend/auth/google/callback`,
    },
    (accessToken: string, refreshToken: string, profile: any, cb: any) => {
      const userBlob: UserBlob = {
        uid: profile.id,
        email: profile.emails[0].value,
        // On Google APIs, we can append this to resize the avatar
        // to 96x96 to save bandwidth.
        picture: `${profile.photos[0].value}=s96`,
        name: profile.displayName,
      };
      return cb(null, userBlob);
    },
  ),
);

Passport.use(
  new GitHubStrategy(
    {
      clientID: config.auth.github.id,
      clientSecret: config.auth.github.secret,
      callbackURL: `${process.env.HOST || ''}/backend/auth/github/callback`,
    },
    (accessToken: string, refreshToken: string, profile: any, cb: any) => {
      const userBlob: UserBlob = {
        uid: profile.id,
        email: profile.emails[0].value,
        picture: profile.photos[0].value,
        name: profile.displayName,
      };
      return cb(null, userBlob);
    },
  ),
);

const options: BackendOptions = {
  // The name of the cookie to store the session in.
  // If you are using Firebase functions,
  // DO NOT CHANGE THE COOKIE NAME!
  // It’s the only one Firebase allows:
  // https://firebase.google.com/docs/hosting/functions#using_cookies
  cookieName: '__session',
  // Secret to encrypt the session cookie with.
  cookieSecret: config.auth.cookiesecret,
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
  authOpts: {
    google: { scope: ['openid', 'email', 'profile'] },
    github: { scope: [] },
  },
  // Length of a session in seconds
  sessionLength: 24 * 60 * 60,
};

export const backend = Functions.https.onRequest(Backend(options));
