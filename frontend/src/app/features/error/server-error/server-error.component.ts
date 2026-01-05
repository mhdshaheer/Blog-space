import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './server-error.component.html'
})
export class ServerErrorComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }

  refresh(): void {
    window.location.reload();
  }
}
