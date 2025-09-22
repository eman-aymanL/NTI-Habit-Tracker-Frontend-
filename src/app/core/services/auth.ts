import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/users'; // Ensure this matches your backend URL
  private apiUrl = 'http://localhost:5000/api'; // Base API URL for habit-related endpoints

  constructor(private http: HttpClient) {}

  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, passwords: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password/${token}`, passwords);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }

  // Habit-related methods
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
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    // Additional cleanup if needed
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  
}