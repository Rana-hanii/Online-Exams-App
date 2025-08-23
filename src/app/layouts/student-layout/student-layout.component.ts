import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from "../../features/student/components/side-bar/side-bar.component";
import { HeaderComponent } from "../../features/student/components/header/header.component";

@Component({
  selector: 'app-student-layout',
  imports: [RouterOutlet, SideBarComponent, HeaderComponent],
  templateUrl: './student-layout.component.html',
  styleUrl: './student-layout.component.css'
})
export class StudentLayoutComponent {

}
