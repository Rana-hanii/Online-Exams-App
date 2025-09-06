import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Select } from 'primeng/select';
import { AuthSidebarComponent } from '../../features/auth/components/auth-sidebar/auth-sidebar.component';
import { LanguageCodes } from '../../shared/enums/language-codes.enum';

interface Language {
  name: string;
  code: LanguageCodes;
}

@Component({
  selector: 'app-auth-layout',
  imports: [
    RouterOutlet,
    AuthSidebarComponent,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    Select,
  ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
  standalone: true,
})
export class AuthLayoutComponent {
  languages: Language[] | undefined;

  selectedLanguage: Language | undefined;

  ngOnInit() {
    this.languages = [
      { name: 'English', code: LanguageCodes.ENGLISH },
      { name: 'العربية', code: LanguageCodes.ARABIC },
    ];
    this.selectedLanguage = this.languages[0];
  }
}
