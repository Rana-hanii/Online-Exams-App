export interface User {
  _id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  isVerified?: boolean;
  createdAt?: string;
  passwordResetCode?: string | null;
  passwordResetExpires?: string | null;
  resetCodeVerified?: boolean;
  passwordChangedAt?: string | null;
}

export interface ProfileResponse {
  message?: string;
  user?: User;
}
