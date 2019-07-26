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
import Passport from 'passport';

import configMiddleware from './config.js';
import sessionMiddleware from './session.js';
import authApp, { authenticationRequiredMiddleware } from './auth.js';
import userApp from './user.js';

const appsRouter = Express();

appsRouter.use('/auth', authApp);

appsRouter.use('/user', authenticationRequiredMiddleware());
appsRouter.use('/user', userApp);

const rootRouter = Express();
rootRouter.use(Passport.initialize());
rootRouter.use(Passport.session());

rootRouter.use(configMiddleware);
rootRouter.use(sessionMiddleware());
rootRouter.use('/backend', appsRouter);

export default rootRouter;
