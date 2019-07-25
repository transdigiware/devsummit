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
import StatusCode from 'http-status-codes';
import BodyParser from 'body-parser';
import Joi from 'joi';

import { Context, UserBlob } from './types.js';

const app = Express();
app.use(BodyParser.json());
app.get('/blob', async (req, res) => {
  const context = res.locals as Context;
  if (!context.userId) {
    res.statusCode = StatusCode.BAD_REQUEST;
    res.send('User not logged in');
    return;
  }
  const userBlob = await context.getUserBlob(context.userId);
  res.send(userBlob);
});

app.post('/blob', async (req, res) => {
  const context = res.locals as Context;
  if (!context.userId) {
    res.statusCode = StatusCode.BAD_REQUEST;
    res.send('User not logged in');
    return;
  }
  const schema = Joi.object({
    uid: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    picture: Joi.string()
      .uri()
      .optional(),
    name: Joi.string().required(),
  });
  await Joi.validate(req.body, schema);
  const userBlob = req.body as UserBlob;
  context.storeUserBlob(userBlob);
  res.statusCode = StatusCode.NO_CONTENT;
  res.send();
});
export default app;
