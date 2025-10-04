import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApplicationError, CustomError, FreeTrialLimitError } from '../../shared/interfaces/error.interface';
import { ErrorDialogService } from './error-dialog.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private messageService: MessageService,
    private zone: NgZone,
    private errorDialogService: ErrorDialogService
  ) {}

  handleError(error: any): void {
    console.error('Global error handler caught:', error);
    
    const appError = this.parseError(error);
    
    switch (appError.type) {
      case 'CUSTOM_ERROR':
        this.handleCustomError(appError.customError!);
        break;
      case 'CONNECT_ERROR':
        this.handleConnectError(appError.connectError!);
        break;
      case 'HTTP_ERROR':
        this.handleHttpError(appError.httpError);
        break;
      default:
        this.handleGenericError(error);
    }
  }

  private parseError(error: any): ApplicationError {
    const appError: ApplicationError = {
      type: 'UNKNOWN_ERROR',
      timestamp: new Date(),
      handled: false,
      originalError: error
    };

    // Check if it's a custom error with the specific structure
    if (error?.error === 'ERROR_CUSTOM_MESSAGE' && error?.details) {
      appError.type = 'CUSTOM_ERROR';
      appError.customError = error as CustomError;
    }
    // Check if it's a ConnectError
    else if (error?.name === 'ConnectError' || error?.message?.includes('ConnectError')) {
      appError.type = 'CONNECT_ERROR';
      appError.connectError = {
        message: error.message || 'Connection error occurred',
        code: error.code,
        stack: error.stack
      };
    }
    // Check if it's an HTTP error
    else if (error?.status !== undefined || error?.error) {
      appError.type = 'HTTP_ERROR';
      appError.httpError = error;
    }

    return appError;
  }

  private handleCustomError(customError: CustomError): void {
    this.zone.run(() => {
      if (this.isFreeTrialLimitError(customError)) {
        // Show dialog for free trial errors
        const appError: ApplicationError = {
          type: 'CUSTOM_ERROR',
          customError,
          timestamp: new Date(),
          handled: true
        };
        this.errorDialogService.showError(appError);
      } else {
        this.showErrorToast(customError.details.title, customError.details.detail);
      }
    });
  }

  private handleFreeTrialLimitError(error: FreeTrialLimitError): void {
    // Display a specific message for free trial limit errors
    const title = error.details.title;
    const message = error.details.detail;
    
    this.messageService.add({
      severity: 'warn',
      summary: title,
      detail: message,
      sticky: true,
      closable: true
    });

    // You could also redirect to pricing page or show a modal
    // this.router.navigate(['/pricing']);
  }

  private handleConnectError(connectError: any): void {
    this.zone.run(() => {
      // Check if it's resource exhausted (free trial limit)
      if (connectError.message?.includes('[resource_exhausted]')) {
        const appError: ApplicationError = {
          type: 'CONNECT_ERROR',
          connectError,
          timestamp: new Date(),
          handled: true
        };
        this.errorDialogService.showError(appError);
      } else {
        this.showErrorToast('Connection Error', 'A connection error occurred. Please try again.');
      }
    });
  }

  private handleHttpError(httpError: any): void {
    this.zone.run(() => {
      const message = httpError?.error?.message || httpError?.message || 'An HTTP error occurred';
      this.showErrorToast('Request Failed', message);
    });
  }

  private handleGenericError(error: any): void {
    this.zone.run(() => {
      console.error('Unhandled error:', error);
      this.showErrorToast('Unexpected Error', 'An unexpected error occurred. Please try again.');
    });
  }

  private showErrorToast(summary: string, detail: string): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 5000
    });
  }

  private isFreeTrialLimitError(error: CustomError): error is FreeTrialLimitError {
    return error.error === 'ERROR_CUSTOM_MESSAGE' && 
           error.details?.title === 'Too many free trials.';
  }
}