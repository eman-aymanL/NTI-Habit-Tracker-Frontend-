import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt?: string;
  lastLogin?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/users';
  private apiUrl = 'http://localhost:5000/api';
  private logoutTimerId: any = null;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  login(credentials: {email: string, password: string}): Observable<any> {
    
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.data && response.data.token) {
          this.setSession(response.data.token);
          localStorage.setItem('username', response.data.user);
                    this.fetchCurrentUser();
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData).pipe(
      tap((response: any) => {
        if (response.data && response.data.token) {
          this.setSession(response.data.token);
          if (response.data.user) {
            this.setCurrentUser(response.data.user);
          } else {
            this.fetchCurrentUser();
          }
        }
      })
    );
  }

  private fetchCurrentUser(): void {
    this.getCurrentUser().subscribe({
      next: (userData: any) => {
        if (userData.data) {
          this.setCurrentUser(userData.data);
        }
      },
      error: (error) => {
        console.error('Failed to fetch user data:', error);
      }
    });
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUserData(): User | null {
    return this.currentUserSubject.value;
  }

  updateUserData(updatedUser: User): void {
    this.setCurrentUser(updatedUser);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, passwords: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password/${token}`, passwords);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`, {
      headers: this.getAuthHeaders()
    });
  }

  addHabit(habitData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/habits`, habitData, {
      headers: this.getAuthHeaders()
    });
  }

  getHabits(): Observable<any> {
    return this.http.get(`${this.apiUrl}/habits`, {
      headers: this.getAuthHeaders()
    });
  }

  updateHabitProgress(habitId: string, progressData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/habits/${habitId}/progress`, progressData, {
      headers: this.getAuthHeaders()
    });
  }

  deleteHabit(habitId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/habits/${habitId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getMe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/me`, {
      headers: this.getAuthHeaders()
    });
  }

  changePassword(passwordData: { oldPassword: string; newPassword: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/change-password`, passwordData, {
      headers: this.getAuthHeaders()
    });
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('token_exp');
    localStorage.removeItem('currentUser'); 
    this.currentUserSubject.next(null); 
    
    if (this.logoutTimerId) {
      clearTimeout(this.logoutTimerId);
      this.logoutTimerId = null;
    }
    
    try {
      this.router.navigate(['/auth/login']);
    } catch {}
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  setSession(token: string): void {
    localStorage.setItem('token', token);
    const exp = this.getTokenExpiration(token);
    if (exp) {
      localStorage.setItem('token_exp', String(exp));
      this.startLogoutTimer(exp - Date.now());
    }
  }

  initAuth(): void {
    const token = this.getToken();
    if (!token) return;
    if (this.isTokenExpired(token)) {
      this.logout();
      return;
    }
    const expMs = this.getStoredExpiration();
    if (expMs) {
      const delay = expMs - Date.now();
      if (delay > 0) this.startLogoutTimer(delay);
    } else {
      const expFromToken = this.getTokenExpiration(token);
      if (expFromToken) this.startLogoutTimer(expFromToken - Date.now());
    }
  }

  private startLogoutTimer(delayMs: number) {
    if (this.logoutTimerId) clearTimeout(this.logoutTimerId);
    if (delayMs <= 0) {
      this.logout();
      return;
    }
    this.logoutTimerId = setTimeout(() => this.logout(), delayMs);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getStoredExpiration(): number | null {
    const val = localStorage.getItem('token_exp');
    if (!val) return null;
    const n = Number(val);
    return Number.isFinite(n) ? n : null;
  }

  private getTokenExpiration(token: string): number | null {
    try {
      const payload = this.parseJwt(token);
      if (!payload || !payload.exp) return null;
      return payload.exp * 1000;
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const exp = this.getTokenExpiration(token);
    if (!exp) return false;
    return Date.now() >= exp;
  }

  private parseJwt(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  }
}