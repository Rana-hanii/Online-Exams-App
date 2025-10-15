import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
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

  constructor(private aos: AosService) {}

  ngOnInit(): void {
    // initialize AOS in browser only (AosService guards against SSR)
    this.aos.init().catch(() => {});
  }
}

