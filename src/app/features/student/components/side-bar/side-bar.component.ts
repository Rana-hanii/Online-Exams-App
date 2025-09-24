import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-side-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent  {
  @Input() isOpen: boolean = false;
  @Output() closeSidebarEvent = new EventEmitter<void>();

  closeSidebar() {
    console.log('Closing sidebar, current isOpen:', this.isOpen);
    this.closeSidebarEvent.emit();
  }
}
