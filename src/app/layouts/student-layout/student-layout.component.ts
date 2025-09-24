import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../features/student/components/header/header.component";
import { SideBarComponent } from "../../features/student/components/side-bar/side-bar.component";

@Component({
  selector: 'app-student-layout',
  imports: [RouterOutlet, SideBarComponent, HeaderComponent],
  templateUrl: './student-layout.component.html',
  styleUrl: './student-layout.component.css'
})
export class StudentLayoutComponent {
  sidebarOpen = false;

  onToggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    console.log('Toggle sidebar, sidebarOpen:', this.sidebarOpen);
  }
}
