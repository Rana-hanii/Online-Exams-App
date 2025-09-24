import { inject } from '@angular/core';
import { API_BASE_URL } from '../tokens/api-base-url.token';

export class AuthEndPoint {
  private static readonly BASE_URL = inject(API_BASE_URL);
  
  //* REGISTER AND LOGIN
  static SIGNIN = `${AuthEndPoint.BASE_URL}/auth/signin`;
  static SIGNUP = `${AuthEndPoint.BASE_URL}/auth/signup`;
  static LOGOUT = `${AuthEndPoint.BASE_URL}/auth/logout`;
  //* FORGET PASSWORD
  static FORGETPASSWORD = `${AuthEndPoint.BASE_URL}/auth/forgotPassword`;
  static VERIFY = `${AuthEndPoint.BASE_URL}/auth/verifyResetCode`;
  static RESETPASSWORD = `${AuthEndPoint.BASE_URL}/auth/resetPassword`;
  //* EDIT USER DATA
  static CHANGEPASSWORD = `${AuthEndPoint.BASE_URL}/auth/changePassword`;
  static DELETEACCOUNT = `${AuthEndPoint.BASE_URL}/auth/deleteMe`;
  static EDITPROFILE = `${AuthEndPoint.BASE_URL}/auth/editProfile`;
 //* ADMIN
  static GETINFO = `${AuthEndPoint.BASE_URL}/auth/profileData`;
}
