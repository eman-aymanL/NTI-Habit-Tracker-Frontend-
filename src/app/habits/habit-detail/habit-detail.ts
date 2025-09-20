import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Habit } from '../../models/habit';
import { HabitService } from '../../services/habit';

@Component({
  selector: 'app-habit-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './habit-detail.html',
  styleUrls: ['./habit-detail.css']
})
export class HabitDetail implements OnInit {
  habit: Habit | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  note: string = '';
  selectedDate: string = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private habitService: HabitService
  ) {}

  ngOnInit(): void {
    this.loadHabit();
  }

  loadHabit(): void {
    const habitId = this.route.snapshot.paramMap.get('id');
    if (!habitId) {
      this.errorMessage = 'Habit ID not found';
      return;
    }

    this.isLoading = true;
    this.habitService.getHabitById(habitId).subscribe({
      next: (habit) => {
        this.habit = habit;
        this.isLoading = false;
        console.log('Habit loaded:', habit);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load habit details: ' + error.message;
        this.isLoading = false;
        console.error('Error loading habit:', error);
      }
    });
  }

  // Check if habit is completed for today
  isTodayCompleted(): boolean {
    if (!this.habit?.progress) return false;
    
    const today = new Date().toISOString().split('T')[0];
    return this.habit.progress.some(p => 
      new Date(p.date).toISOString().split('T')[0] === today && p.done
    );
  }

  // Get today's progress note
  getTodaysNote(): string {
    if (!this.habit?.progress) return '';
    
    const today = new Date().toISOString().split('T')[0];
    const todaysProgress = this.habit.progress.find(p => 
      new Date(p.date).toISOString().split('T')[0] === today
    );
    
    return todaysProgress?.note || '';
  }

  // Mark habit as done for today
  markAsDone(): void {
    if (!this.habit?._id) {
      this.errorMessage = 'Habit ID is missing';
      return;
    }

    this.isLoading = true;
    this.habitService.updateHabitProgress(this.habit._id, {
      date: new Date(),
      done: true,
      note: this.note
    }).subscribe({
      next: (updatedHabit) => {
        this.habit = updatedHabit;
        this.note = '';
        this.isLoading = false;
        this.successMessage = 'Progress updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update progress: ' + error.message;
        this.isLoading = false;
        console.error('Error marking as done:', error);
      }
    });
  }

  // Mark habit as not done for today
  markAsNotDone(): void {
    if (!this.habit?._id) {
      this.errorMessage = 'Habit ID is missing';
      return;
    }

    this.isLoading = true;
    this.habitService.updateHabitProgress(this.habit._id, {
      date: new Date(),
      done: false,
      note: ''
    }).subscribe({
      next: (updatedHabit) => {
        this.habit = updatedHabit;
        this.isLoading = false;
        this.successMessage = 'Progress updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update progress: ' + error.message;
        this.isLoading = false;
        console.error('Error marking as not done:', error);
      }
    });
  }

  // Calculate progress percentage
  getProgressPercentage(): number {
    if (!this.habit?.progress || this.habit.progress.length === 0) return 0;
    
    const total = this.habit.progress.length;
    const completed = this.habit.progress.filter(p => p.done).length;
    return Math.round((completed / total) * 100);
  }

  // Calculate current streak
  getCurrentStreak(): number {
    if (!this.habit?.progress) return 0;
    
    const sortedProgress = [...this.habit.progress]
      .filter(p => p.done)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (sortedProgress.length === 0) return 0;

    let streak = 1;
    const today = new Date();
    
    for (let i = 0; i < sortedProgress.length - 1; i++) {
      const currentDate = new Date(sortedProgress[i].date);
      const nextDate = new Date(sortedProgress[i + 1].date);
      
      // Check if consecutive days
      const diffTime = Math.abs(currentDate.getTime() - nextDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  // Get completed count
  getCompletedCount(): number {
    return this.habit?.progress?.filter(p => p.done).length || 0;
  }

  // Get total tracked days
  getTotalTrackedDays(): number {
    return this.habit?.progress?.length || 0;
  }

  // Format frequency for display
  getFrequencyDisplay(): string {
    if (!this.habit) return '';
    
    switch (this.habit.frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'custom': return 'Custom (' + (this.habit.daysOfWeek?.length || 0) + ' days/week)';
      default: return this.habit.frequency;
    }
  }


// Check if today is a valid day for this habit
isTodayValidForHabit(): boolean {
  if (!this.habit) return false;
  
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  if (this.habit.frequency === 'daily') {
    return true; // Daily habits are valid every day
  }
  
  if (this.habit.frequency === 'weekly') {
    return true; // Weekly habits are valid every day (user chooses when to complete)
  }
  
  if (this.habit.frequency === 'custom' && this.habit.daysOfWeek) {
    return this.habit.daysOfWeek.includes(today); // Check if today is in custom days
  }
  
  return false;
}

// Get the next valid day for this habit
getNextValidDay(): Date {
  if (!this.habit) return new Date();
  
  const today = new Date();
  const todayDay = today.getDay();
  
  if (this.habit.frequency === 'daily') {
    return today; // Daily habits - every day is valid
  }
  
  if (this.habit.frequency === 'weekly') {
    return today; // Weekly habits - every day is valid
  }
  
  if (this.habit.frequency === 'custom' && this.habit.daysOfWeek) {
    // Find the next valid day in the custom schedule
    const validDays = this.habit.daysOfWeek.sort();
    
    for (let i = 1; i <= 7; i++) {
      const nextDay = (todayDay + i) % 7;
      if (validDays.includes(nextDay)) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        return nextDate;
      }
    }
  }
  
  return today;
}

// Get human-readable schedule description
getHabitSchedule(): string {
  if (!this.habit) return '';
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  switch (this.habit.frequency) {
    case 'daily':
      return 'Every day';
    
    case 'weekly':
      return 'Once per week (any day)';
    
    case 'custom':
      if (!this.habit.daysOfWeek || this.habit.daysOfWeek.length === 0) {
        return 'No specific days scheduled';
      }
      
      const days = this.habit.daysOfWeek
        .sort()
        .map(day => dayNames[day])
        .join(', ');
      
      return days;
    
    default:
      return this.habit.frequency;
  }
}
}