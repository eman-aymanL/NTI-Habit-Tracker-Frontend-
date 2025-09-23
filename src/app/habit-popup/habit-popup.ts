import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Habit } from '../models/habit';
import { HabitService } from '../services/habit';

@Component({
  selector: 'app-habit-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habit-popup.html',
  styleUrls: ['./habit-popup.css']
})
export class HabitPopupComponent {
  @Output() habitCreated = new EventEmitter<Habit>();
  @Output() closePopup = new EventEmitter<void>();

  habit: Habit = {
    title: '',
    description: '',
    frequency: 'daily',
    user: '',
    reminderTime: '',
    color: '#4caf50',
    startDate: undefined,
    endDate: undefined
  };

  isOpen: boolean = true;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  daysOfWeek = [
    { name: 'Sunday', value: 0, selected: false },
    { name: 'Monday', value: 1, selected: false },
    { name: 'Tuesday', value: 2, selected: false },
    { name: 'Wednesday', value: 3, selected: false },
    { name: 'Thursday', value: 4, selected: false },
    { name: 'Friday', value: 5, selected: false },
    { name: 'Saturday', value: 6, selected: false }
  ];

  constructor(private habitService: HabitService) {}

  ngOnInit(): void {
    // Set default color
    if (!this.habit.color) {
      this.habit.color = '#4caf50';
    }
  }

  updateDaysSelection(): void {
    if (this.habit.daysOfWeek) {
      this.daysOfWeek.forEach(day => {
        day.selected = this.habit.daysOfWeek!.includes(day.value);
      });
    }
  }

  onFrequencyChange(): void {
    if (this.habit.frequency !== 'custom') {
      this.habit.daysOfWeek = undefined;
      this.daysOfWeek.forEach(day => day.selected = false);
    }
  }

  toggleDaySelection(day: any): void {
    day.selected = !day.selected;
    
    if (!this.habit.daysOfWeek) {
      this.habit.daysOfWeek = [];
    }
    
    if (day.selected) {
      if (!this.habit.daysOfWeek.includes(day.value)) {
        this.habit.daysOfWeek.push(day.value);
      }
    } else {
      this.habit.daysOfWeek = this.habit.daysOfWeek.filter(d => d !== day.value);
    }
    
    if (this.habit.daysOfWeek.length === 0) {
      this.habit.daysOfWeek = undefined;
    }
  }

  onSubmit(): void {
    if (!this.habit.title.trim()) {
      this.errorMessage = 'Title is required';
      return;
    }

    if (this.habit.frequency === 'custom' && (!this.habit.daysOfWeek || this.habit.daysOfWeek.length === 0)) {
      this.errorMessage = 'Please select at least one day for custom frequency';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.habitService.createHabit(this.habit).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Habit created successfully!';
        
        setTimeout(() => {
          this.habitCreated.emit(response);
          this.close();
        }, 1000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to create habit. Please try again.';
        console.error('Error creating habit:', error);
      }
    });
  }

  close(): void {
    this.isOpen = false;
    this.closePopup.emit();
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}