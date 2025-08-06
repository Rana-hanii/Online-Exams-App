import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthAPIAdaptorService } from './adaptor/auth-api.adaptor';
import { authAPI } from './base/authAPI';
import { AuthEndPoint } from './enums/AuthEndPoint';
import { IForgetPasswordReq } from './interfaces/forget-password/IForgetPasswordReq';
import { IForgetPasswordRes } from './interfaces/forget-password/IForgetPasswordRes';
import { ILogOutRes } from './interfaces/log-out/ILogOutRes';
import { IResetPasswordReq } from './interfaces/reset-password/IResetPasswordReq';
import { IResetPasswordRes } from './interfaces/reset-password/IResetPasswordRes';
import { ISignInReq } from './interfaces/sign-in/ISignInReq';
import { ISignInRes } from './interfaces/sign-in/ISignInRes';
import { ISignUpReq } from './interfaces/sign-up/ISignUpReq';
import { ISignUpRes } from './interfaces/sign-up/ISignUpRes';
import { ICodeReq } from './interfaces/verify-code/ICodeReq';
import { ICodeRes } from './interfaces/verify-code/ICodeRes';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService implements authAPI {
  _HttpClient = inject(HttpClient);
  _AuthAPIAdaptorService = inject(AuthAPIAdaptorService);

  
  SignUp(data: ISignUpReq): Observable<ISignUpRes> {
    return this._HttpClient.post(AuthEndPoint.SIGNUP, data).pipe(
      map((res: any) => this._AuthAPIAdaptorService.adaptSignUp(res)),
      catchError((err) => of(err))
    );
  }

  SignIn(data: ISignInReq): Observable<ISignInRes> {
    return this._HttpClient.post(AuthEndPoint.SIGNIN, data).pipe(
      map((res: any) => this._AuthAPIAdaptorService.adaptSignIn(res)),
      catchError((err) => of(err))
    );
  }

  LogOut(): Observable<ILogOutRes> {
    return this._HttpClient.post(AuthEndPoint.LOGOUT, {}).pipe(
      map((res: any) => this._AuthAPIAdaptorService.adaptLogOut(res)),
      catchError((err) => of(err))
    );
  }

  ForgetPassword(data: IForgetPasswordReq): Observable<IForgetPasswordRes> {
    return this._HttpClient.post(AuthEndPoint.FORGETPASSWORD, data).pipe(
      map((res: any) => this._AuthAPIAdaptorService.adaptForgetPassword(res)),
      catchError((err) => of(err))
    );
  }

  VerifyCode(data: ICodeReq): Observable<ICodeRes> {
    return this._HttpClient.post(AuthEndPoint.VERIFY, data).pipe(
      map((res: any) => this._AuthAPIAdaptorService.adaptVerifyCode(res)),
      catchError((err) => of(err))
    );
  }

  ResetPassword(data: IResetPasswordReq): Observable<IResetPasswordRes> {
    return this._HttpClient.put(AuthEndPoint.RESETPASSWORD, data).pipe(
      map((res: any) => this._AuthAPIAdaptorService.adaptResetPassword(res)),
      catchError((err) => of(err))
    );
  }
}
