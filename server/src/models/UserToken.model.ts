export interface UserToken {
  userId: string;
  token: string;
  createdAt?: string;
  expires: number;
}
