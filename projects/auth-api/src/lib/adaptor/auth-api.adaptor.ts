import { Injectable } from '@angular/core';
import { Adaptor } from '../interfaces/adaptor';
import { AdaptedForgetPasswordRes } from '../interfaces/adaptor/AdaptedForgetPasswordRes';
import { AdaptedLogOutRes } from '../interfaces/adaptor/AdaptedLogOutRes';
import { AdaptedResetPasswordRes } from '../interfaces/adaptor/AdaptedResetPasswordRes';
import { AdaptedSignInRes } from '../interfaces/adaptor/AdaptedSignInRes';
import { AdaptedSignUpRes } from '../interfaces/adaptor/AdaptedSignUpRes';
import { AdaptedVerifyCodeRes } from '../interfaces/adaptor/AdaptedVerifyCodeRes';
import { IForgetPasswordRes } from '../interfaces/forget-password/IForgetPasswordRes';
import { ILogOutRes } from '../interfaces/log-out/ILogOutRes';
import { IResetPasswordRes } from '../interfaces/reset-password/IResetPasswordRes';
import { ISignInRes } from '../interfaces/sign-in/ISignInRes';
import { ISignUpRes } from '../interfaces/sign-up/ISignUpRes';
import { ICodeRes } from '../interfaces/verify-code/ICodeRes';

@Injectable({
  providedIn: 'root',
})
export class AuthAPIAdaptorService implements Adaptor {
  constructor() {}

  // * ADAPTOR METHODS FOR SIGNUP RESPONSE
  adaptSignUp(data: ISignUpRes): AdaptedSignUpRes {
    return {
      message: data.message,
      username: data.user.username,
      email: data.user.email,
      role: data.user.role
    };
  }

  // * ADAPTOR METHODS FOR SIGN IN RESPONSE
  adaptSignIn(data: ISignInRes): AdaptedSignInRes {
    return {
      message: data.message,
      token: data.token,
      username: data.user.username,
    };
  }

  // * ADAPTOR METHODS FOR LOGOUT RESPONSE
  adaptLogOut(data: ILogOutRes): AdaptedLogOutRes {
    return {
      message: data.message,
    };
  }

  // * ADAPTOR METHODS FOR FORGET PASS RESPONSE
  adaptForgetPassword(data: IForgetPasswordRes): AdaptedForgetPasswordRes {
    return {
      message: data.message,
      info: data.info,
    };
  }
  // * ADAPTOR METHODS FOR VERIFY CODE RESPONSE
  adaptVerifyCode(data: ICodeRes): AdaptedVerifyCodeRes {
    return {
      status: data.status,
    };
  }

  // * ADAPTOR METHODS FOR RESET PASS RESPONSE
  adaptResetPassword(data: IResetPasswordRes): AdaptedResetPasswordRes {
    return {
      message: data.message,
      token: data.token,
    };
  }
}
