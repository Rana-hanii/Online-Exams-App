import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AosDirective } from '../../../../shared/directives/aos.directive';


@Component({
  selector: 'app-auth-sidebar',
  imports: [RouterModule, AosDirective],
  templateUrl: './auth-sidebar.component.html',
  styleUrl: './auth-sidebar.component.css',
  standalone: true
})
export class AuthSidebarComponent {

}
