import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
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
  isProfileOpen = false;

  @ViewChild('profileMenu', { static: false })
  profileMenu?: ElementRef<HTMLElement>;

  constructor(
    private authService: AuthService,
    private toast: ToastService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfileMenu(event?: Event): void {
    event?.stopPropagation();
    this.isProfileOpen = !this.isProfileOpen;
  }

  closeProfileMenu(): void {
    this.isProfileOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isProfileOpen) return;

    const target = event.target as Node | null;
    const menuEl = this.profileMenu?.nativeElement;

    if (!target || !menuEl) {
      this.closeProfileMenu();
      return;
    }

    if (menuEl.contains(target)) return;
    this.closeProfileMenu();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.isProfileOpen) return;
    this.closeProfileMenu();
  }

  logout(): void {
    this.authService.logout();
    this.toast.success('Successfully logged out');
    this.isMenuOpen = false;
    this.isProfileOpen = false;
  }
}
