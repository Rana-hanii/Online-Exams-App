import { Injectable } from '@angular/core';
import { Adaptor } from '../interfaces/adaptor';

@Injectable({
  providedIn: 'root',
})
export class AuthAPIAdaptorService implements Adaptor {
  constructor() {}

  // * ADAPTOR METHODS FOR SIGNUP RESPONSE
  adaptSignUp(data: any) {
    return {};
  }

  // * ADAPTOR METHODS FOR SIGN IN RESPONSE
  adaptSignIn(data: any) {
    return {
      message: data.message,
      token: data.token,
      email: data.user.email,
    };
  }

  // * ADAPTOR METHODS FOR LOGOUT RESPONSE
   adaptLogOut(data: any) {
    return {};
  }

  // * ADAPTOR METHODS FOR FORGET PASS RESPONSE

  adaptForgetPassword(data: any) {
    return {
      message: data.message,
    };
  }
  // * ADAPTOR METHODS FOR VERIFY CODE RESPONSE
  adaptVerifyCode(data: any) {
    return {
      message: data.message,
    };
  }

  // * ADAPTOR METHODS FOR RESET PASS RESPONSE
  adaptResetPassword(data: any) {
    return {
      message: data.message,
    };
  }
}
