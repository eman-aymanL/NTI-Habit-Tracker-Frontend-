import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '.././core/services/auth';

interface Habit {
  _id?: string;
  title: string;
  description: string;
  frequency: string;
  color?: string;
  icon?: string;
  archived?: boolean;
  progress?: any[];
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habits.html',
  styleUrls: ['./habits.css']
})
export class Habits implements OnInit {
  habits: Habit[] = [];
  newHabit: Habit = {
    title: '',
    description: '',
    frequency: 'daily'
  };
  isAdding: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadHabits();
  }

  checkAuthentication(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Please login first.';
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  loadHabits() {
    if (!this.checkAuthentication()) return;
    
    this.isLoading = true;
    this.auth.getHabits().subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.habits = response.data;
          console.log('Loaded habits:', this.habits);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load habits', err);
        this.errorMessage = 'Failed to load habits. Please try again.';
      }
    });
  }

  addHabit() {
    if (!this.checkAuthentication()) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    console.log('Sending habit data:', this.newHabit);
    
    this.auth.addHabit(this.newHabit).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Habit added successfully:', response);
        if (response.success) {
          this.habits.push(response.data);
          this.resetNewHabit();
          this.isAdding = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to add habit - Full error:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error response:', err.error);
        
        if (err.status === 401) {
          this.errorMessage = 'Please login again. Your session may have expired.';
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Failed to add habit. Please try again.';
        }
      }
    });
  }

  toggleHabitProgress(habit: Habit) {
    if (!habit._id) return;
    
    const today = new Date().toISOString().split('T')[0];
    const isDoneToday = habit.progress?.some((p: any) => 
      new Date(p.date).toISOString().split('T')[0] === today && p.done
    );
    
    const progressData = {
      date: new Date().toISOString(),
      done: !isDoneToday
    };
    
    this.auth.updateHabitProgress(habit._id, progressData).subscribe({
      next: (response: any) => {
        if (response.success) {
          const index = this.habits.findIndex(h => h._id === habit._id);
          if (index !== -1) {
            this.habits[index] = response.data;
          }
        }
      },
      error: (err) => {
        console.error('Failed to update habit progress', err);
        this.errorMessage = 'Failed to update habit. Please try again.';
      }
    });
  }

  isHabitDoneToday(habit: Habit): boolean {
    const today = new Date().toISOString().split('T')[0];
    return habit.progress?.some((p: any) => 
      new Date(p.date).toISOString().split('T')[0] === today && p.done
    ) || false;
  }

  getTodaysProgress(habit: Habit): any {
    const today = new Date().toISOString().split('T')[0];
    return habit.progress?.find((p: any) => 
      new Date(p.date).toISOString().split('T')[0] === today
    );
  }

  deleteHabit(habitId: string | undefined) {
    if (!habitId) return;
    
    if (confirm('Are you sure you want to delete this habit?')) {
      this.auth.deleteHabit(habitId).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.habits = this.habits.filter(habit => habit._id !== habitId);
          }
        },
        error: (err) => {
          console.error('Failed to delete habit', err);
          this.errorMessage = 'Failed to delete habit. Please try again.';
        }
      });
    }
  }

  resetNewHabit() {
    this.newHabit = {
      title: '',
      description: '',
      frequency: 'daily'
    };
  }

  getProgressCount(habit: Habit): number {
    return habit.progress?.filter((p: any) => p.done).length || 0;
  }
}