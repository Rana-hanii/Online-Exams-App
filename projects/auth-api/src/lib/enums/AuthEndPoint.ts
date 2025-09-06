export class AuthEndPoint {
  //* REGISTER AND LOGIN
  static SIGNIN = `https://exam.elevateegy.com/api/v1/auth/signin`;
  static SIGNUP = `https://exam.elevateegy.com/api/v1/auth/signup`;
  static LOGOUT = `https://exam.elevateegy.com/api/v1/auth/logout`;
  //* FORGET PASSWORD
  static FORGETPASSWORD = `https://exam.elevateegy.com/api/v1/auth/forgotPassword`;
  static VERIFY = `https://exam.elevateegy.com/api/v1/auth/verifyResetCode`;
  static RESETPASSWORD = `https://exam.elevateegy.com/api/v1/auth/resetPassword`;
  //* EDIT USER DATA
  static CHANGEPASSWORD = `https://exam.elevateegy.com/api/v1/auth/changePassword`;
  static DELETEACCOUNT = `https://exam.elevateegy.com/api/v1/auth/deleteMe`;
  static EDITPROFILE = `https://exam.elevateegy.com/api/v1/auth/editProfile`;
 //* ADMIN
  static GETINFO = `https://exam.elevateegy.com/api/v1/auth/profileData`;
}
