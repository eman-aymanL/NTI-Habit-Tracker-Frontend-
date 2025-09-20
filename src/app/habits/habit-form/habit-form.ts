import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Habit } from '../../models/habit';
import { HabitService } from '../../services/habit';

@Component({
  selector: 'app-habit-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './habit-form.html',
  styleUrls: ['./habit-form.css']
})
export class HabitFormComponent implements OnInit {
  habit: Habit = {
    title: '',
    description: '',
    frequency: 'daily',
    user: ''
  };
  
  isEditMode: boolean = false;
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

  constructor(
    private habitService: HabitService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const habitId = this.route.snapshot.paramMap.get('id');
    
    if (habitId && habitId !== 'new') {
      this.isEditMode = true;
      this.loadHabit(habitId);
    }
  }

  loadHabit(id: string): void {
    this.isLoading = true;
    this.habitService.getHabitById(id).subscribe({
      next: (habit) => {
        this.habit = habit;
        this.updateDaysSelection();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load habit. Please try again.';
        this.isLoading = false;
        console.error('Error loading habit:', error);
      }
    });
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

    if (this.isEditMode) {
      this.updateHabit();
    } else {
      this.createHabit();
    }
  }

createHabit(): void {
  this.habitService.createHabit(this.habit).subscribe({
    next: (response) => {
      this.isLoading = false;
      this.successMessage = 'Habit created successfully!';
      
      // الانتظار قليلاً لرؤية رسالة النجاح ثم الانتقال
      setTimeout(() => {
        this.router.navigate(['/habits']); // بدون state
      }, 1000);
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage = 'Failed to create habit. Please try again.';
      console.error('Error creating habit:', error);
    }
  });
}

updateHabit(): void {
  if (!this.habit._id) return;
  
  this.habitService.updateHabit(this.habit._id, this.habit).subscribe({
    next: (response) => {
      this.isLoading = false;
      this.successMessage = 'Habit updated successfully!';
      setTimeout(() => {
        this.router.navigate(['/habits']); // بدون state
      }, 1000);
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage = 'Failed to update habit. Please try again.';
      console.error('Error updating habit:', error);
    }
  });
}

  cancel(): void {
    this.router.navigate(['/habits']);
  }
}
