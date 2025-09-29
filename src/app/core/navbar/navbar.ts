import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth';
import { UiService } from '../services/ui';
import { ThemeService } from '../services/theme';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  isProfileMenuOpen = false;
  @ViewChild('profileMenuContainer', { static: false })
  profileMenuContainer?: ElementRef<HTMLElement>;
  @ViewChild('leftMenuContainer', { static: false })
  leftMenuContainer?: ElementRef<HTMLElement>;

  constructor(
    public authService: AuthService,
    private router: Router,
    private ui: UiService,
    public theme: ThemeService
  ) {
    this.ui.profileMenuToggle$.subscribe((action) => {
      if (action === 'toggle') this.toggleProfileMenu();
      if (action === 'open') this.isProfileMenuOpen = true;
      if (action === 'close') this.isProfileMenuOpen = false;
    });

    // Close menus on navigation
    this.router.events.subscribe(() => {
      this.isProfileMenuOpen = false;
      this.isMobileMenuOpen = false;
    });
  }

  // No lifecycle hooks needed

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Close profile menu if open
    if (this.isMobileMenuOpen) {
      this.isProfileMenuOpen = false;
    }
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  // Close menus when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (this.isProfileMenuOpen) {
      const profileHost = this.profileMenuContainer?.nativeElement;
      if (profileHost && target && !profileHost.contains(target)) {
        this.isProfileMenuOpen = false;
      }
    }
    if (this.isMobileMenuOpen) {
      const leftHost = this.leftMenuContainer?.nativeElement;
      if (leftHost && target && !leftHost.contains(target)) {
        this.isMobileMenuOpen = false;
      }
    }
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.isProfileMenuOpen = false;
    this.isMobileMenuOpen = false;
    this.router.navigate(['/auth/login']);
  }

  // Close on ESC key
  @HostListener('document:keydown.escape')
  onEscape() {
    this.isProfileMenuOpen = false;
    this.isMobileMenuOpen = false;
  }
}
