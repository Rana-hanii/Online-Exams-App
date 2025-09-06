
export interface ISignUpRes{
  message: string;
  token: string;
  user: User;
}
export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  _id: string;
  createdAt: string;
}