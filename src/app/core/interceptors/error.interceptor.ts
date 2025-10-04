import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export interface CustomErrorDetails {
  title: string;
  detail: string;
  additionalInfo?: any;
  buttons?: any[];
  planChoices?: any[];
}

export interface CustomError {
  error: string;
  details: CustomErrorDetails;
  isExpected: boolean;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle specific ERROR_CUSTOM_MESSAGE errors
      if (error.error?.error === 'ERROR_CUSTOM_MESSAGE') {
        const customError: CustomError = error.error;
        handleCustomError(customError, messageService, router);
      }
      // Handle ConnectError with resource_exhausted
      else if (error.message?.includes('ConnectError') && error.message?.includes('resource_exhausted')) {
        handleFreeTrialLimitError(messageService, router);
      }
      
      return throwError(() => error);
    })
  );
};

function handleCustomError(customError: CustomError, messageService: MessageService, router: Router): void {
  const { details } = customError;
  
  // Check if this is a free trial limit error
  if (details.title?.toLowerCase().includes('free trial') || 
      details.detail?.toLowerCase().includes('free trial')) {
    handleFreeTrialLimitError(messageService, router, details);
  } else {
    // Handle other custom errors
    messageService.add({
      severity: 'error',
      summary: details.title || 'Error',
      detail: details.detail || 'An unexpected error occurred',
      life: 10000,
    });
  }
}

function handleFreeTrialLimitError(
  messageService: MessageService, 
  router: Router, 
  details?: CustomErrorDetails
): void {
  const title = details?.title || 'Free Trial Limit Exceeded';
  const message = details?.detail || 
    'Too many free trial accounts used on this machine. Please upgrade to pro. We have this limit in place to prevent abuse. Please let us know if you believe this is a mistake.';
  
  // Show immediate toast notification
  messageService.add({
    severity: 'error',
    summary: title,
    detail: message,
    life: 8000,
  });

  // Redirect to dedicated error page after a short delay
  setTimeout(() => {
    console.warn('Free trial limit exceeded. Redirecting to error page.');
    router.navigate(['/auth/free-trial-limit']);
  }, 3000);
}