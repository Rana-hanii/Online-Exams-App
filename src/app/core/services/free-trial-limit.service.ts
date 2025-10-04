import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

export interface FreeTrialErrorDetails {
  title?: string;
  detail?: string;
  additionalInfo?: any;
}

@Injectable({
  providedIn: 'root'
})
export class FreeTrialLimitService {
  private messageService = inject(MessageService);
  private router = inject(Router);

  /**
   * Checks if an error is related to free trial limit exceeded
   */
  isFreeTrialLimitError(error: any): boolean {
    // Check for ERROR_CUSTOM_MESSAGE with free trial details
    if (error?.error === 'ERROR_CUSTOM_MESSAGE') {
      const details = error.details;
      return details?.title?.toLowerCase().includes('free trial') || 
             details?.detail?.toLowerCase().includes('free trial');
    }
    
    // Check for nested error structure
    if (error?.error?.error === 'ERROR_CUSTOM_MESSAGE') {
      const details = error.error.details;
      return details?.title?.toLowerCase().includes('free trial') || 
             details?.detail?.toLowerCase().includes('free trial');
    }
    
    // Check for ConnectError with resource_exhausted
    if (error?.message?.includes('ConnectError') && error?.message?.includes('resource_exhausted')) {
      return true;
    }
    
    // Check error message directly
    if (typeof error === 'string' && error.toLowerCase().includes('free trial')) {
      return true;
    }
    
    return false;
  }

  /**
   * Handles the free trial limit error by showing appropriate messages and redirecting
   */
  handleFreeTrialLimitError(details?: FreeTrialErrorDetails): void {
    const title = details?.title || 'Free Trial Limit Exceeded';
    const message = details?.detail || 
      'Too many free trial accounts used on this machine. Please upgrade to pro.';
    
    // Show immediate notification
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: 8000,
    });

    // Log for debugging
    console.warn('Free trial limit exceeded:', details);

    // Redirect to dedicated error page
    setTimeout(() => {
      this.router.navigate(['/auth/free-trial-limit']);
    }, 2000);
  }

  /**
   * Navigates to the pricing page
   */
  goToPricing(): void {
    window.open('https://www.cursor.com/pricing', '_blank');
  }

  /**
   * Opens support contact
   */
  contactSupport(): void {
    const subject = 'Free Trial Limit Error - Account Review Request';
    const body = 'Hello Cursor Support,\n\nI am receiving a "Too many free trials" error message, but I believe this may be a mistake. Could you please review my account?\n\nThank you for your assistance.';
    const mailtoLink = `mailto:support@cursor.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  }
}