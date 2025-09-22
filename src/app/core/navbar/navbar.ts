import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  isProfileMenuOpen = false;
  @ViewChild('profileMenuContainer', { static: false }) profileMenuContainer?: ElementRef<HTMLElement>;

  constructor(public authService: AuthService, private router: Router) {}

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

  // Close profile menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isProfileMenuOpen) return;
    const target = event.target as HTMLElement | null;
    const host = this.profileMenuContainer?.nativeElement;
    if (host && target && !host.contains(target)) {
      this.isProfileMenuOpen = false;
    }
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.isProfileMenuOpen = false;
    this.isMobileMenuOpen = false;
    this.router.navigate(['/auth/login']);
  }
}