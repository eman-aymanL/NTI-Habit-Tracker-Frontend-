import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { Habit } from '../models/habit';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private apiUrl = 'http://localhost:5000/api/habits';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  getHabits(): Observable<Habit[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(this.apiUrl, { headers }).pipe(map((response) => response.data));
  }

  getHabitById(id: string): Observable<Habit> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<any>(`${this.apiUrl}/${id}`, { headers })
      .pipe(map((response) => response.data));
  }

  createHabit(habit: Habit): Observable<Habit> {
    const headers = this.getAuthHeaders();
    return this.http
      .post<any>(this.apiUrl, habit, { headers })
      .pipe(map((response) => response.data));
  }

  updateHabit(id: string, habit: Habit): Observable<Habit> {
    const headers = this.getAuthHeaders();
    return this.http
      .put<any>(`${this.apiUrl}/${id}`, habit, { headers })
      .pipe(map((response) => response.data));
  }

  deleteHabit(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }

  updateHabitProgress(id: string, progressData: any): Observable<Habit> {
    const headers = this.getAuthHeaders();
    return this.http
      .put<any>(`${this.apiUrl}/${id}/progress`, progressData, { headers })
      .pipe(map((response) => response.data));
  }
}
