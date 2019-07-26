export interface UserBlob {
  uid: string;
  email: string;
  picture?: string;
  name: string;
}

export interface Context {
  userId?: string;
}
