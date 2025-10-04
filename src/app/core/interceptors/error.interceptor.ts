import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { ApplicationError, CustomError, FreeTrialLimitError } from '../../shared/interfaces/error.interface';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error Interceptor caught:', error);
      
      const appError = parseHttpError(error);
      handleHttpError(appError, messageService);
      
      return throwError(() => error);
    })
  );
};

function parseHttpError(error: HttpErrorResponse): ApplicationError {
  const appError: ApplicationError = {
    type: 'HTTP_ERROR',
    timestamp: new Date(),
    handled: false,
    originalError: error,
    httpError: error
  };

  // Check if the error response contains the custom error structure
  if (error.error?.error === 'ERROR_CUSTOM_MESSAGE') {
    appError.type = 'CUSTOM_ERROR';
    appError.customError = error.error as CustomError;
  }

  return appError;
}

function handleHttpError(appError: ApplicationError, messageService: MessageService): void {
  switch (appError.type) {
    case 'CUSTOM_ERROR':
      handleCustomHttpError(appError.customError!, messageService);
      break;
    case 'HTTP_ERROR':
      handleGenericHttpError(appError.httpError, messageService);
      break;
    default:
      console.error('Unhandled HTTP error type:', appError.type);
  }
}

function handleCustomHttpError(customError: CustomError, messageService: MessageService): void {
  if (isFreeTrialLimitError(customError)) {
    const freeTrialError = customError as FreeTrialLimitError;
    messageService.add({
      severity: 'warn',
      summary: freeTrialError.details.title,
      detail: freeTrialError.details.detail,
      sticky: true,
      closable: true
    });
  } else {
    messageService.add({
      severity: 'error',
      summary: customError.details.title,
      detail: customError.details.detail,
      life: 5000
    });
  }
}

function handleGenericHttpError(httpError: HttpErrorResponse, messageService: MessageService): void {
  let errorMessage = 'An error occurred';
  let severity: 'error' | 'warn' | 'info' = 'error';

  switch (httpError.status) {
    case 0:
      errorMessage = 'Unable to connect to server. Please check your internet connection.';
      break;
    case 400:
      errorMessage = httpError.error?.message || 'Bad request. Please check your input.';
      break;
    case 401:
      errorMessage = 'Unauthorized. Please log in again.';
      break;
    case 403:
      errorMessage = 'Access forbidden. You don\'t have permission for this action.';
      break;
    case 404:
      errorMessage = 'The requested resource was not found.';
      break;
    case 429:
      errorMessage = 'Too many requests. Please wait and try again.';
      severity = 'warn';
      break;
    case 500:
      errorMessage = 'Internal server error. Please try again later.';
      break;
    case 502:
    case 503:
    case 504:
      errorMessage = 'Service temporarily unavailable. Please try again later.';
      severity = 'warn';
      break;
    default:
      errorMessage = httpError.error?.message || httpError.message || 'An unexpected error occurred';
  }

  messageService.add({
    severity,
    summary: 'Request Failed',
    detail: errorMessage,
    life: 5000
  });
}

function isFreeTrialLimitError(error: CustomError): error is FreeTrialLimitError {
  return error.error === 'ERROR_CUSTOM_MESSAGE' && 
         error.details?.title === 'Too many free trials.';
}