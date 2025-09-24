import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Habit } from '../../models/habit';
import { HabitService } from '../../services/habit';
import { HabitPopupComponent } from '../../habit-popup/habit-popup';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faGlassWater,
  faDumbbell,
  faMoon,
  faAppleWhole,
  faPersonPraying,
  faBookOpen,
  faGraduationCap,
  faSpa,
  faPenNib,
  faPuzzlePiece,
  faCalendarCheck,
  faBullseye,
  faMobileScreen,
  faBroom,
  faHandsPraying,
  faBook,
  faHeart,
  faHandHoldingHeart,
  faPhone,
  faFaceSmile,
  faUserPlus,
  faMugHot,
  faFileLines,
  faListCheck,
  faPersonWalking,
  faSprayCan,
  faCar
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HabitPopupComponent ,FontAwesomeModule],
  templateUrl: './habit-list.html',
  styleUrls: ['./habit-list.css']
})
export class HabitListComponent implements OnInit {
  habits: Habit[] = [];
  filteredHabits: Habit[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  filterStatus: string = 'active';
  sortBy: string = 'newest';
  showPopup: boolean = false;

  constructor(
    private habitService: HabitService,
    private router: Router
  ) {}

  getIconByName(iconName: string): any {
  const iconMap: { [key: string]: any } = {
    'faGlassWater': faGlassWater,
    'faDumbbell': faDumbbell,
    'faMoon': faMoon,
    'faAppleWhole': faAppleWhole,
    'faPersonPraying': faPersonPraying,
    'faBookOpen': faBookOpen,
    'faGraduationCap': faGraduationCap,
    'faSpa': faSpa,
    'faPenNib': faPenNib,
    'faPuzzlePiece': faPuzzlePiece,
    'faCalendarCheck': faCalendarCheck,
    'faBullseye': faBullseye,
    'faMobileScreen': faMobileScreen,
    'faBroom': faBroom,
    'faHandsPraying': faHandsPraying,
    'faBook': faBook,
    'faHeart': faHeart,
    'faHandHoldingHeart': faHandHoldingHeart,
    'faPhone': faPhone,
    'faFaceSmile': faFaceSmile,
    'faUserPlus': faUserPlus,
    'faMugHot': faMugHot,
    'faFileLines': faFileLines,
    'faListCheck': faListCheck,
    'faPersonWalking': faPersonWalking,
    'faSprayCan': faSprayCan,
    'faCar': faCar
  };
  
  return iconMap[iconName] || faBullseye;
}

  ngOnInit(): void {
    this.loadHabits();

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
          this.getProgressPercentage(b) - this.getProgressPercentage(a)
        );
        break;
    }

    this.filteredHabits = filtered;
  }

  getProgressPercentage(habit: Habit): number {
    const prog = habit.progress || [];
    const total = prog.length;
    const completed = prog.filter(p => p.done).length;
    return total ? Math.round((completed / total) * 100) : 0;
  }

  getCompletedCount(habit: Habit): number {
    return (habit.progress || []).filter(p => p.done).length;
  }

  getTotalCount(habit: Habit): number {
    return habit.progress?.length || 0;
  }
  

  deleteHabit(habitId: string): void {
  if (confirm('Are you sure you want to delete this habit?')) {
    this.habitService.deleteHabit(habitId).subscribe({
      next: () => {
        this.habits = this.habits.filter(h => h._id !== habitId);
        this.successMessage = 'Habit deleted successfully!';
        this.errorMessage = ''; 
                setTimeout(() => {
          this.successMessage = '';
        }, 3000);
        
        this.applyFilters();
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete habit. Please try again.';
        this.successMessage = '';
        console.error('Error deleting habit:', error);
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
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

  openPopup(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  onHabitCreated(newHabit: Habit): void {
    this.habits.push(newHabit);
    this.applyFilters();
    this.closePopup();
  }
}