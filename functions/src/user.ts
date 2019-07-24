import * as Express from 'express';
import * as FbAdmin from 'firebase-admin';

import { AuthenticatedRequest } from './auth.js';

// This is a weird hack because the Express typings are awful.
// https://github.com/rollup/rollup/issues/670
// tslint:disable-next-line:variable-name
const Express_ = Express;

interface UserAppOptions {
  fbAdmin: typeof FbAdmin;
}
export function UserApp({ fbAdmin }: UserAppOptions) {
  async function info(req: AuthenticatedRequest, res: Express.Response) {
    const userInfo = (await fbAdmin
      .database()
      .ref('users')
      .child(req.userId!)
      .once('value')).val();
    res.send(userInfo);
  }

  const app = Express_();
  app.get('/info', info);
  return app;
}
