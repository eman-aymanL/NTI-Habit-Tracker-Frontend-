import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Source of truth is the <html> element's `dark` class, persisted in localStorage('theme')
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme';
  private readonly isDarkSubject = new BehaviorSubject<boolean>(this.readInitial());
  readonly isDark$ = this.isDarkSubject.asObservable();

  private readInitial(): boolean {
    try {
      const ls = localStorage.getItem(this.storageKey);
      if (ls === 'dark') return true;
      if (ls === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  }

  constructor() {
    // Ensure DOM reflects initial state
    this.apply(this.isDarkSubject.value);
  }

  setDark(isDark: boolean) {
    this.apply(isDark);
    this.persist(isDark);
    this.isDarkSubject.next(isDark);
  }

  toggle() {
    this.setDark(!this.isDarkSubject.value);
  }

  private apply(isDark: boolean) {
    const doc = document.documentElement;
    if (isDark) doc.classList.add('dark');
    else doc.classList.remove('dark');
  }

  private persist(isDark: boolean) {
    try {
      localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
    } catch {}
  }
}
