import { AdaptedForgetPasswordRes } from "./adaptor/AdaptedForgetPasswordRes";
import { AdaptedLogOutRes } from "./adaptor/AdaptedLogOutRes";
import { AdaptedResetPasswordRes } from "./adaptor/AdaptedResetPasswordRes";
import { AdaptedSignInRes } from "./adaptor/AdaptedSignInRes";
import { AdaptedSignUpRes } from "./adaptor/AdaptedSignUpRes";
import { AdaptedVerifyCodeRes } from "./adaptor/AdaptedVerifyCodeRes";
import { IForgetPasswordRes } from "./forget-password/IForgetPasswordRes";
import { ILogOutRes } from "./log-out/ILogOutRes";
import { IResetPasswordRes } from "./reset-password/IResetPasswordRes";
import { ISignInRes } from "./sign-in/ISignInRes";
import { ISignUpRes } from "./sign-up/ISignUpRes";
import { ICodeRes } from "./verify-code/ICodeRes";

export interface Adaptor{
    adaptSignUp(data: ISignUpRes): AdaptedSignUpRes;
    adaptSignIn(data: ISignInRes): AdaptedSignInRes;
    adaptLogOut(data: ILogOutRes): AdaptedLogOutRes;
    adaptForgetPassword(data: IForgetPasswordRes): AdaptedForgetPasswordRes;
    adaptVerifyCode(data: ICodeRes): AdaptedVerifyCodeRes;
    adaptResetPassword(data: IResetPasswordRes): AdaptedResetPasswordRes;
}
