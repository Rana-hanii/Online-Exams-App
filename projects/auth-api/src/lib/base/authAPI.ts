import { Observable } from 'rxjs';

export abstract class authAPI {
  abstract SignUp(data: any): Observable<any>;
  abstract SignIn(data: any): Observable<any>;
  abstract LogOut(data: any): Observable<any>;
  abstract ForgetPassword(data: any): Observable<any>;
  abstract VerifyCode(data: any): Observable<any>;
  abstract ResetPassword(data: any): Observable<any>;
}
