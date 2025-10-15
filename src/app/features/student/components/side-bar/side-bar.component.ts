import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthTokenService } from '../../../../core/services/auth-token.service';
import { AosDirective } from '../../../../shared/directives/aos.directive';

@Component({
  selector: 'app-side-bar',
  imports: [RouterLink, RouterLinkActive,AosDirective],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  @Input() isOpen: boolean = false;
  @Output() closeSidebarEvent = new EventEmitter<void>();
  _authTokenService = inject(AuthTokenService);
  router = inject(Router);

  closeSidebar() {
    console.log('Closing sidebar, current isOpen:', this.isOpen);
    this.closeSidebarEvent.emit();

    // Add a slight delay to allow for any closing animations
    setTimeout(() => {
      this.isOpen = false;
      console.log('Sidebar closed, isOpen now:', this.isOpen);
    }, 300);
  }
  logout() {
    this._authTokenService.clearToken();
    this.router.navigate(['/auth/sign-in']);
  }
}
