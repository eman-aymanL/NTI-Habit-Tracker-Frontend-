import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  register(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, userData);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, credentials);
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

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  
}