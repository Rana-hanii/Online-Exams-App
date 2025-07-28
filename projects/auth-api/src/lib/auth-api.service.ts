import { AuthAPIAdaptorService } from './adaptor/auth-api.adaptor';
import { inject, Injectable } from '@angular/core';
import { authAPI } from './base/authAPI';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthEndPoint } from './enums/AuthEndPoint';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService implements authAPI {
  _HttpClient = inject(HttpClient);

  _AuthAPIAdaptorService = inject(AuthAPIAdaptorService);

  SignUp(data: any): Observable<any> {
    return this._HttpClient.post(AuthEndPoint.SIGNUP, data).pipe(
      map((res) => this._AuthAPIAdaptorService.adaptSignUp(res)),
      catchError((err) => of(err))
    );
  }

  SignIn(data: any): Observable<any> {
    return this._HttpClient.post(AuthEndPoint.SIGNIN, data).pipe(
      map((res) => this._AuthAPIAdaptorService.adaptSignIn(res)),
      catchError((err) => of(err))
    );
  }

  LogOut(data: any): Observable<any> {
    return this._HttpClient.post(AuthEndPoint.LOGOUT, data).pipe(
      map((res) => this._AuthAPIAdaptorService.adaptLogOut(res)),
      catchError((err) => of(err))
    );
  }

  ForgetPassword(data: any): Observable<any> {
    return this._HttpClient.post(AuthEndPoint.FORGETPASSWORD, data).pipe(
      map((res) => this._AuthAPIAdaptorService.adaptForgetPassword(res)),
      catchError((err) => of(err))
    );
  }

  VerifyCode(data: any): Observable<any> {
    return this._HttpClient.post(AuthEndPoint.VERIFY, data).pipe(
      map((res) => this._AuthAPIAdaptorService.adaptVerifyCode(res)),
      catchError((err) => of(err))
    );
  }

  ResetPassword(data: any): Observable<any> {
    return this._HttpClient.post(AuthEndPoint.RESETPASSWORD, data).pipe(
      map((res) => this._AuthAPIAdaptorService.adaptResetPassword(res)),
      catchError((err) => of(err))
    );
  }
}
