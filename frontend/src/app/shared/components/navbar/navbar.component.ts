import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent {
  currentUser$;
  isMenuOpen = false;

  constructor(
    private authService: AuthService,
    private toast: ToastService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.toast.success('Successfully logged out');
    this.isMenuOpen = false;
  }
}
