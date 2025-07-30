import { Observable } from 'rxjs';
import { ISignUpReq } from '../interfaces/sign-up/ISignUpReq';
import { ISignUpRes } from '../interfaces/sign-up/ISignUpRes';
import { ISignInReq } from '../interfaces/sign-in/ISignInReq';
import { ISignInRes } from '../interfaces/sign-in/ISignInRes';
import { ILogOutRes } from '../interfaces/log-out/ILogOutRes';
import { IForgetPasswordReq } from '../interfaces/forget-password/IForgetPasswordReq';
import { IForgetPasswordRes } from '../interfaces/forget-password/IForgetPasswordRes';
import { ICodeReq } from '../interfaces/verify-code/ICodeReq';
import { ICodeRes } from '../interfaces/verify-code/ICodeRes';
import { IResetPasswordReq } from '../interfaces/reset-password/IResetPasswordReq';
import { IResetPasswordRes } from '../interfaces/reset-password/IResetPasswordRes';

export abstract class authAPI {
  abstract SignUp(data: ISignUpReq): Observable<ISignUpRes>;
  abstract SignIn(data: ISignInReq): Observable<ISignInRes>;
  abstract LogOut(): Observable<ILogOutRes>;
  abstract ForgetPassword(data: IForgetPasswordReq): Observable<IForgetPasswordRes>;
  abstract VerifyCode(data: ICodeReq): Observable<ICodeRes>;
  abstract ResetPassword(data: IResetPasswordReq): Observable<IResetPasswordRes>;
}
