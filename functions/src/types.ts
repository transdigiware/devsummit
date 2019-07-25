export interface UserBlob {
  uid: string;
  email: string;
  picture?: string;
  name: string;
}

export interface Context {
  userId?: string;
  cookieName: string;
  cookieSecret: string;
  storeUserBlob(blob: UserBlob): Promise<void>;
  getUserBlob(uid: string): Promise<UserBlob | null>;
  oauthCredentials: any[];
  sessionLength: number;
}
