import { Observable } from 'rxjs';
import { AdaptedForgetPasswordRes } from '../interfaces/adaptor/AdaptedForgetPasswordRes';
import { AdaptedLogOutRes } from '../interfaces/adaptor/AdaptedLogOutRes';
import { AdaptedResetPasswordRes } from '../interfaces/adaptor/AdaptedResetPasswordRes';
import { AdaptedSignInRes } from '../interfaces/adaptor/AdaptedSignInRes';
import { AdaptedSignUpRes } from '../interfaces/adaptor/AdaptedSignUpRes';
import { AdaptedVerifyCodeRes } from '../interfaces/adaptor/AdaptedVerifyCodeRes';
import { IForgetPasswordReq } from '../interfaces/forget-password/IForgetPasswordReq';
import { IResetPasswordReq } from '../interfaces/reset-password/IResetPasswordReq';
import { ISignInReq } from '../interfaces/sign-in/ISignInReq';
import { ISignUpReq } from '../interfaces/sign-up/ISignUpReq';
import { ICodeReq } from '../interfaces/verify-code/ICodeReq';

export abstract class authAPI {
  abstract SignUp(data: ISignUpReq): Observable<AdaptedSignUpRes>;
  abstract SignIn(data: ISignInReq): Observable<AdaptedSignInRes>;
  abstract LogOut(): Observable<AdaptedLogOutRes>;
  abstract ForgetPassword(data: IForgetPasswordReq): Observable<AdaptedForgetPasswordRes>;
  abstract VerifyCode(data: ICodeReq): Observable<AdaptedVerifyCodeRes>;
  abstract ResetPassword(data: IResetPasswordReq): Observable<AdaptedResetPasswordRes>;
}
