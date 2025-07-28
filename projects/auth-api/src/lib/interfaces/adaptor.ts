export interface Adaptor{
    adaptSignUp(data: any): any;
    adaptSignIn(data: any): any;
    adaptLogOut(data: any): any;
    adaptForgetPassword(data: any): any;
    adaptVerifyCode(data: any): any;
    adaptResetPassword(data: any): any;
}
