import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthAPIAdaptorService } from './adaptor/auth-api.adaptor';
import { authAPI } from './base/authAPI';
import { AuthEndPoint } from './enums/AuthEndPoint';
import { AdaptedForgetPasswordRes } from './interfaces/adaptor/AdaptedForgetPasswordRes';
import { AdaptedLogOutRes } from './interfaces/adaptor/AdaptedLogOutRes';
import { AdaptedResetPasswordRes } from './interfaces/adaptor/AdaptedResetPasswordRes';
import { AdaptedSignInRes } from './interfaces/adaptor/AdaptedSignInRes';
import { AdaptedSignUpRes } from './interfaces/adaptor/AdaptedSignUpRes';
import { AdaptedVerifyCodeRes } from './interfaces/adaptor/AdaptedVerifyCodeRes';
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

  
  SignUp(data: ISignUpReq): Observable<AdaptedSignUpRes> {
    return this._HttpClient.post<ISignUpRes>(AuthEndPoint.SIGNUP, data).pipe(
      map((res: ISignUpRes ) => this._AuthAPIAdaptorService.adaptSignUp(res)),
      catchError((err) => of(err))
    );
  }

  SignIn(data: ISignInReq): Observable<AdaptedSignInRes> {
    return this._HttpClient.post<ISignInRes>(AuthEndPoint.SIGNIN, data).pipe(
      map((res: ISignInRes ) => this._AuthAPIAdaptorService.adaptSignIn(res)),
      catchError((err) => of(err))
    );
  }

  LogOut(): Observable<AdaptedLogOutRes> {
    return this._HttpClient.post<ILogOutRes>(AuthEndPoint.LOGOUT, {}).pipe(
      map((res: ILogOutRes) => this._AuthAPIAdaptorService.adaptLogOut(res)),
      catchError((err) => of(err))
    );
  }

  ForgetPassword(data: IForgetPasswordReq): Observable<AdaptedForgetPasswordRes> {
    return this._HttpClient.post<IForgetPasswordRes>(AuthEndPoint.FORGETPASSWORD, data).pipe(
      map((res: IForgetPasswordRes) => this._AuthAPIAdaptorService.adaptForgetPassword(res)),
      catchError((err) => of(err))
    );
  }

  VerifyCode(data: ICodeReq): Observable<AdaptedVerifyCodeRes> {
    return this._HttpClient.post<ICodeRes>(AuthEndPoint.VERIFY, data).pipe(
      map((res: ICodeRes) => this._AuthAPIAdaptorService.adaptVerifyCode(res)),
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
