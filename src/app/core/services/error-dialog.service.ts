import { Injectable, ComponentRef, ViewContainerRef, inject } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { ApplicationError } from '../../interfaces/error.interface';

export interface ErrorDialogData {
  title: string;
  message: string;
  isFreeTrialError: boolean;
  error: ApplicationError;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {
  private errorSubject = new Subject<ErrorDialogData>();
  private visibleSubject = new BehaviorSubject<boolean>(false);
  
  public error$ = this.errorSubject.asObservable();
  public visible$ = this.visibleSubject.asObservable();
  
  showError(error: ApplicationError) {
    const dialogData = this.createDialogData(error);
    this.errorSubject.next(dialogData);
    this.visibleSubject.next(true);
  }
  
  showCustomError(title: string, message: string, isFreeTrialError = false) {
    const error: ApplicationError = {
      type: 'UNKNOWN_ERROR',
      timestamp: new Date(),
      handled: true
    };
    
    const dialogData: ErrorDialogData = {
      title,
      message,
      isFreeTrialError,
      error
    };
    
    this.errorSubject.next(dialogData);
    this.visibleSubject.next(true);
  }
  
  hideError() {
    this.visibleSubject.next(false);
  }
  
  private createDialogData(error: ApplicationError): ErrorDialogData {
    let title = 'Error';
    let message = 'An unexpected error occurred';
    let isFreeTrialError = false;
    
    switch (error.type) {
      case 'CUSTOM_ERROR':
        if (error.customError) {
          title = error.customError.details?.title || title;
          message = error.customError.details?.detail || message;
          isFreeTrialError = this.checkIfFreeTrialError(error.customError);
        }
        break;
        
      case 'CONNECT_ERROR':
        title = 'Connection Error';
        if (error.connectError?.message?.includes('[resource_exhausted]')) {
          title = 'Service Limit Reached';
          message = 'You have reached the service usage limit. Please upgrade your account or try again later.';
          isFreeTrialError = true;
        } else {
          message = error.connectError?.message || 'A connection error occurred';
        }
        break;
        
      case 'HTTP_ERROR':
        title = 'Request Failed';
        message = error.httpError?.error?.message || error.httpError?.message || 'An HTTP error occurred';
        break;
        
      default:
        title = 'Unexpected Error';
        message = 'An unexpected error occurred. Please try again.';
    }
    
    return {
      title,
      message,
      isFreeTrialError,
      error
    };
  }
  
  private checkIfFreeTrialError(error: any): boolean {
    return error?.error === 'ERROR_CUSTOM_MESSAGE' && 
           error?.details?.title === 'Too many free trials.';
  }
}