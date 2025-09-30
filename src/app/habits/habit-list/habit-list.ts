import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Habit } from '../../models/habit';
import { HabitService } from '../../services/habit';
import { HabitCard } from '../../shared/habit-card/habit-card';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HabitCard],
  templateUrl: './habit-list.html',
  styleUrls: ['./habit-list.css']
})
export class HabitList implements OnInit {
  habits: Habit[] = [];
  filteredHabits: Habit[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  
  filterStatus: string = 'active';
  sortBy: string = 'newest';

  constructor(
    private habitService: HabitService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHabits();
    
    // الاستماع لأحداث التنقل وتحديث البيانات عند العودة إلى هذه الصفحة
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/habits') {
        this.loadHabits();
      }
    });
  }

  loadHabits(): void {
    this.isLoading = true;
    this.habitService.getHabits().subscribe({
      next: (habits) => {
        this.habits = habits;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load habits. Please try again.';
        this.isLoading = false;
        console.error('Error loading habits:', error);
      }
    });
  }

  applyFilters(): void {
    let filtered = this.habits;
    
    if (this.filterStatus === 'active') {
      filtered = filtered.filter(habit => !habit.archived);
    } else if (this.filterStatus === 'archived') {
      filtered = filtered.filter(habit => habit.archived);
    }
    
    switch (this.sortBy) {
      case 'newest':
        filtered = filtered.sort((a, b) => 
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
        break;
      case 'oldest':
        filtered = filtered.sort((a, b) => 
          new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
        );
        break;
      case 'progress':
        filtered = filtered.sort((a, b) => 
          this.progressPercentage(b) - this.progressPercentage(a)
        );
        break;
    }
    
    this.filteredHabits = filtered;
  }

  private isSameDay(a: Date | string, b: Date | string): boolean {
    const da = new Date(a);
    const db = new Date(b);
    return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
  }

  private isDoneToday(habit: Habit): boolean {
    const today = new Date();
    return (habit.progress || []).some(p => this.isSameDay(p.date, today) && !!p.done);
  }

  private progressPercentage(habit: Habit): number {
    const prog = habit.progress || [];
    const total = prog.length;
    const completed = prog.filter(p => p.done).length;
    return total ? Math.round((completed / total) * 100) : 0;
  }

  deleteHabit(habitId: string): void {
    if (confirm('Are you sure you want to delete this habit?')) {
      this.habitService.deleteHabit(habitId).subscribe({
        next: () => {
          this.habits = this.habits.filter(h => h._id !== habitId);
          this.applyFilters();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete habit. Please try again.';
          console.error('Error deleting habit:', error);
        }
      });
    }
  }

  toggleArchive(habit: Habit): void {
    const updatedHabit = { ...habit, archived: !habit.archived };
    this.habitService.updateHabit(habit._id!, updatedHabit).subscribe({
      next: (updated) => {
        const index = this.habits.findIndex(h => h._id === habit._id);
        if (index !== -1) {
          this.habits[index] = updated;
          this.applyFilters();
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to update habit. Please try again.';
        console.error('Error updating habit:', error);
      }
    });
  }

  // ==== Handlers for HabitCard events ====
  onToggleToday(habit: Habit): void {
    if (!habit._id) return;
    const original: Habit = JSON.parse(JSON.stringify(habit));
    const today = new Date();
    const done = !this.isDoneToday(habit);

    // Optimistic update: update progress locally
    let progress = habit.progress ? [...habit.progress] : [];
    const pIdx = progress.findIndex(p => this.isSameDay(p.date as any, today));
    if (pIdx > -1) {
      const existing = progress[pIdx];
      progress[pIdx] = { ...existing, done } as any;
    } else {
      progress = [...progress, { date: today, done, note: '' } as any];
    }
    const optimisticHabit: Habit = { ...habit, progress };
    this.replaceHabitInArrays(optimisticHabit);
    this.applyFilters();

    // Server update
    const payload = { date: today, done } as any;
    this.habitService.updateHabitProgress(habit._id, payload).subscribe({
      next: (updated) => {
        this.replaceHabitInArrays(updated);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error toggling today progress:', error);
        // Rollback
        this.replaceHabitInArrays(original);
        this.applyFilters();
      }
    });
  }

  onEditHabit(habit: Habit): void {
    this.router.navigate(['/habits', habit._id, 'edit']);
  }

  onDeleteHabit(habit: Habit): void {
    if (!habit._id) return;
    this.deleteHabit(habit._id);
  }

  trackById(index: number, habit: Habit) {
    return habit._id || index;
  }

  private replaceHabitInArrays(updated: Habit) {
    this.habits = this.habits.map(h => (h._id === updated._id ? updated : h));
    // filteredHabits will be recalculated by applyFilters; keeping logic centralized
  }
}