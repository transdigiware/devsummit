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

import { AuthApp } from './auth.js';

import { UserData } from './types.js';

import * as Express from 'express';
import * as fbAdmin from 'firebase-admin';
import * as Functions from 'firebase-functions';

// This is a weird hack because the Express typings are awful.
// https://github.com/rollup/rollup/issues/670
// tslint:disable-next-line:variable-name
const Express_ = Express;
const config = Functions.config();

const callback = 'http://localhost:5000/backend/auth/oauth2callback';
const sessionLengthInSeconds = 24 * 60 * 60;
const databaseURL = 'https://cds2019-d4673.firebaseio.com/';

const cookieSecret = config.auth.cookiesecret;
const clientId = config.auth.oauth2id;
const clientSecret = config.auth.oauth2secret;
const googleOnly = (config.auth.googleonly || '').toLowerCase() === 'true';

fbAdmin.initializeApp(
  Object.assign({}, config.firebase, {
    credential: fbAdmin.credential.cert(config.serviceaccount),
    databaseURL,
  }),
);

const app = Express_();

const authApp = AuthApp({
  callback,
  clientId,
  clientSecret,
  cookieSecret,
  loginFilter: googleOnly
    ? (user: UserData) => user.email.endsWith('@google.com')
    : () => true,
  sessionLengthInSeconds,
  userDbFactory: () => fbAdmin.database().ref('users'),
});
app.use('/auth', authApp.app);

app.use('/user', authApp.needsAuthenticatedUser());
app.get('/user', (req, res) => res.send({ displayName: 'lol' }));

const router = Express_();
router.use('/backend', app);
export const backend = Functions.https.onRequest(router);
