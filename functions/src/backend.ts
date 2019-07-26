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
import Passport, { AuthenticateOptions } from 'passport';

import SessionMiddleware from './session.js';
import AuthApp, { authenticationRequiredMiddleware } from './auth.js';
import UserApp from './user.js';
import { UserBlob } from './types.js';
import { catchMiddleware } from './utils.js';

export interface BackendOptions {
  cookieName: string;
  cookieSecret: string;
  storeUserBlob: (blob: UserBlob) => Promise<void>;
  getUserBlob: (uid: string) => Promise<UserBlob | null>;
  authOpts: { [x: string]: AuthenticateOptions };
  sessionLength: number;
}

export default function Backend(options: BackendOptions) {
  const appsRouter = Express();

  appsRouter.use('/auth', AuthApp(options));

  appsRouter.use('/user', authenticationRequiredMiddleware());
  appsRouter.use('/user', UserApp(options));

  const rootRouter = Express();
  rootRouter.use(Passport.initialize());
  rootRouter.use(Passport.session());

  rootRouter.use(SessionMiddleware(options));
  rootRouter.use('/backend', catchMiddleware(appsRouter));
  return rootRouter;
}
