/*
 * Public API Surface of auth-api
 */

//! Services
export * from './lib/auth-api.service';

//! Base classes
export * from './lib/base/authAPI';

//! Interfaces
export * from './lib/interfaces/adaptor';

//! Request Interfaces
export * from './lib/interfaces/forget-password/IForgetPasswordReq';
export * from './lib/interfaces/reset-password/IResetPasswordReq';
export * from './lib/interfaces/sign-in/ISignInReq';
export * from './lib/interfaces/sign-up/ISignUpReq';
export * from './lib/interfaces/verify-code/ICodeReq';

//! Response Interfaces
export * from './lib/interfaces/forget-password/IForgetPasswordRes';
export * from './lib/interfaces/log-out/ILogOutRes';
export * from './lib/interfaces/reset-password/IResetPasswordRes';
export type { ISignInRes } from './lib/interfaces/sign-in/ISignInRes';
export type { ISignUpRes } from './lib/interfaces/sign-up/ISignUpRes';
export * from './lib/interfaces/verify-code/ICodeRes';

//! User Interface (export from sign-up to avoid conflicts)
export type { User } from './lib/interfaces/sign-up/ISignUpRes';

//! Enums
export * from './lib/enums/AuthEndPoint';

//! Tokens
export * from './lib/tokens/api-base-url.token';

//! Adapters
export * from './lib/adaptor/auth-api.adaptor';



