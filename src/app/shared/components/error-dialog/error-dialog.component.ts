import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { ErrorDialogService, ErrorDialogData } from '../../../core/services/error-dialog.service';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog 
      [(visible)]="visible" 
      [modal]="true"
      [closable]="closable"
      [draggable]="false"
      [resizable]="false"
      styleClass="error-dialog"
      [style]="{ width: '450px' }">
      
      <ng-template pTemplate="header">
        <div class="flex align-items-center gap-2">
          <i [class]="headerIcon" [style]="{ color: headerIconColor, fontSize: '1.5rem' }"></i>
          <span class="font-semibold">{{ title }}</span>
        </div>
      </ng-template>
      
      <div class="flex flex-column gap-3">
        <p class="m-0 text-color-secondary line-height-3">{{ message }}</p>
        
        <div *ngIf="isFreeTrialError" class="bg-yellow-50 border-1 border-yellow-300 p-3 border-round">
          <div class="flex flex-column gap-2">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-exclamation-triangle text-yellow-600"></i>
              <span class="text-sm font-medium text-yellow-800">Free Trial Limit Reached</span>
            </div>
            <p class="m-0 text-sm text-yellow-700">
              You've reached the limit for free trial accounts on this device. 
              To continue using our services, please upgrade to a Pro account.
            </p>
          </div>
        </div>
      </div>
      
      <ng-template pTemplate="footer">
        <div class="flex gap-2 justify-content-end">
          <p-button 
            *ngIf="!isFreeTrialError"
            label="OK" 
            severity="secondary"
            (onClick)="onConfirm()" 
            size="small">
          </p-button>
          
          <div *ngIf="isFreeTrialError" class="flex gap-2">
            <p-button 
              label="Learn More" 
              severity="secondary"
              (onClick)="onLearnMore()" 
              size="small">
            </p-button>
            <p-button 
              label="Upgrade to Pro" 
              severity="warning"
              (onClick)="onUpgrade()" 
              size="small">
            </p-button>
          </div>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep .error-dialog .p-dialog-header {
      background: var(--red-50);
      border-bottom: 1px solid var(--red-200);
    }
    
    :host ::ng-deep .error-dialog .p-dialog-header.free-trial {
      background: var(--yellow-50);
      border-bottom: 1px solid var(--yellow-200);
    }
    
    :host ::ng-deep .error-dialog .p-dialog-content {
      padding: 1.5rem;
    }
    
    :host ::ng-deep .error-dialog .p-dialog-footer {
      padding: 1rem 1.5rem;
      background: var(--surface-50);
      border-top: 1px solid var(--surface-200);
    }
  `]
})
export class ErrorDialogComponent implements OnInit, OnDestroy {
  private errorDialogService = inject(ErrorDialogService);
  
  visible = false;
  title = '';
  message = '';
  isFreeTrialError = false;
  closable = true;
  
  get headerIcon(): string {
    return this.isFreeTrialError ? 'pi pi-exclamation-triangle' : 'pi pi-times-circle';
  }
  
  get headerIconColor(): string {
    return this.isFreeTrialError ? '#f59e0b' : '#dc2626';
  }

  private subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(
      this.errorDialogService.error$.subscribe((errorData: ErrorDialogData) => {
        this.title = errorData.title;
        this.message = errorData.message;
        this.isFreeTrialError = errorData.isFreeTrialError;
        this.closable = !errorData.isFreeTrialError;
      })
    );
    
    this.subscription.add(
      this.errorDialogService.visible$.subscribe((visible: boolean) => {
        this.visible = visible;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onConfirm() {
    this.errorDialogService.hideError();
  }

  onLearnMore() {
    // Open documentation or help page
    window.open('https://www.cursor.com/pricing', '_blank');
    this.errorDialogService.hideError();
  }

  onUpgrade() {
    // Redirect to pricing/upgrade page
    window.open('https://www.cursor.com/pricing', '_blank');
    this.errorDialogService.hideError();
  }
}