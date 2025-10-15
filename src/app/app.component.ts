import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs/operators';
import { AosService } from './core/services/aos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [ButtonModule, RouterOutlet]
})
export class AppComponent implements OnInit{
  title = 'Online-Exams-App';
  constructor(private aos: AosService, private router: Router) {}

  ngOnInit(): void {
    // initialize AOS in browser only (AosService guards against SSR)
    this.aos.init().catch(() => {});

    // On route change, refresh AOS to discover newly rendered elements
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        // using a small timeout ensures elements rendered by components are present
        setTimeout(() => this.aos.refresh(), 50);
      });
  }
}

