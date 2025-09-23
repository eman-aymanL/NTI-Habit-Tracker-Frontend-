import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarView } from '../shared/calendar-view/calendar-view';
import { HabitService } from '../services/habit';
import { Habit } from '../models/habit';

@Component({
  selector: 'app-progress-tracker',
  standalone: true,
  imports: [CommonModule, CalendarView],
  templateUrl: './progress-tracker.html',
  styleUrl: './progress-tracker.css'
})
export class ProgressTracker implements OnInit {
  habits: Habit[] = [];
  isLoading = false;
  errorMessage = '';

  month = new Date().getMonth();
  year = new Date().getFullYear();
  doneDates: Array<string | Date> = [];

  constructor(private habitService: HabitService) {}

  ngOnInit() {
    this.fetchHabits();
  }

  private fetchHabits() {
    this.isLoading = true;
    this.habitService.getHabits().subscribe({
      next: (habits) => {
        this.habits = habits;
        this.computeDoneDates();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load habits for calendar', err);
        this.errorMessage = 'Failed to load data';
        this.isLoading = false;
      }
    });
  }

  private computeDoneDates() {
    const dates: Array<string | Date> = [];
    for (const h of this.habits) {
      for (const p of h.progress || []) {
        if (p.done && p.date) {
          dates.push(p.date);
        }
      }
    }
    this.doneDates = dates;
  }

  onMonthChanged(e: { month: number; year: number }) {
    this.month = e.month;
    this.year = e.year;
  }

  onDateSelected(d: Date) {
    // Optional: filter or open details for the selected date
    // console.log('Date selected', d);
  }
}
