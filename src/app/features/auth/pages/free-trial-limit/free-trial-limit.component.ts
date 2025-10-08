import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-free-trial-limit',
  imports: [ButtonModule],
  templateUrl: './free-trial-limit.component.html',
  styleUrl: './free-trial-limit.component.css'
})
export class FreeTrialLimitComponent {
  private router = inject(Router);

  goToPricing(): void {
    // Open Cursor pricing page in new tab
    window.open('https://www.cursor.com/pricing', '_blank');
  }

  contactSupport(): void {
    // Open email client or support page
    const subject = 'Free Trial Limit Error - Account Review Request';
    const body = 'Hello Cursor Support,\n\nI am receiving a "Too many free trials" error message, but I believe this may be a mistake. Could you please review my account?\n\nThank you for your assistance.';
    const mailtoLink = `mailto:support@cursor.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  }

  goToSignIn(): void {
    this.router.navigate(['/auth/sign-in']);
  }
}