import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth';
import { UiService } from '../core/services/ui';
import { HabitService } from '../services/habit';
import { Habit } from '../models/habit';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faEnvelope,
  faCalendarAlt,
  faChartLine,
  faTrophy,
  faFire,
  faCheckCircle,
  faEdit,
  faSignOutAlt,
  faCog,
  faBell,
  faPalette,
  faMoon,
  faSun,
  faGlassWater,
  faDumbbell,
  faBookOpen,
  faHeart,
  faCar,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {
  user: any = null;
  habits: Habit[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  activeTab: string = 'overview';
  defaultProfileImage: string =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

  // Statistics
  totalHabits: number = 0;
  completedHabits: number = 0;
  currentStreak: number = 0;
  totalProgress: number = 0;

  // Icons
  icons = {
    user: faUser,
    envelope: faEnvelope,
    calendar: faCalendarAlt,
    chart: faChartLine,
    trophy: faTrophy,
    fire: faFire,
    check: faCheckCircle,
    edit: faEdit,
    logout: faSignOutAlt,
    settings: faCog,
    bell: faBell,
    palette: faPalette,
    moon: faMoon,
    sun: faSun,
  };

  iconMap: { [key: string]: any } = {
    faGlassWater: faGlassWater,
    faDumbbell: faDumbbell,
    faBookOpen: faBookOpen,
    faHeart: faHeart,
    faCar: faCar,
  };

  preferencesForm = {
    theme: 'light',
    notifications: true,
    language: 'en',
  };

  constructor(
    private authService: AuthService,
    private habitService: HabitService,
    private router: Router,
    private ui: UiService
  ) {}

  ngOnInit(): void {
    console.log('Profile component initialized');
    this.loadUserData();
    this.loadHabits();
  }
  loadUserData(): void {
    console.log('Loading user data...');

    // الطريقة الصحيحة لاسترجاع البيانات من LocalStorage
    const storedUserData = localStorage.getItem('currentUser');
    console.log('Raw stored data:', storedUserData);

    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        console.log('Parsed data:', parsedData);

        // البيانات قد تكون مباشرة أو داخل خاصية user
        if (parsedData.user) {
          this.user = parsedData.user; // إذا كانت داخل user
        } else if (parsedData.username) {
          this.user = parsedData; // إذا كانت مباشرة
        } else if (parsedData.data) {
          this.user = parsedData.data; // إذا كانت داخل data
        }

        if (this.user) {
          console.log('User data loaded successfully:', this.user);
          this.isLoading = false;

          this.authService.updateUserData(this.user);
          return;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    this.user = this.authService.getCurrentUserData();
    if (this.user) {
      console.log('User data loaded from AuthService:', this.user);
      this.isLoading = false;
      return;
    }

    console.log('Fetching user data from server...');
    this.authService.getCurrentUser().subscribe({
      next: (response: any) => {
        if (response.data) {
          this.user = response.data;
          this.authService.updateUserData(this.user);
        } else if (response.user) {
          this.user = response.user;
          this.authService.updateUserData(this.user);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.errorMessage = 'Failed to load user data';
        this.isLoading = false;
      },
    });
  }

  getIconByName(iconName: string): any {
    return this.iconMap[iconName] || 'faCheckCircle';
  }

  loadHabits(): void {
    this.habitService.getHabits().subscribe({
      next: (habits) => {
        this.habits = habits;
        this.calculateStatistics();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load habits';
        this.isLoading = false;
      },
    });
  }

  calculateStatistics(): void {
    this.totalHabits = this.habits.length;
    this.completedHabits = this.habits.filter(
      (habit) => habit.progress && habit.progress.some((p) => p.done)
    ).length;

    const totalProgress = this.habits.reduce((sum, habit) => {
      return sum + this.getHabitProgressPercentage(habit);
    }, 0);

    this.totalProgress = this.totalHabits > 0 ? Math.round(totalProgress / this.totalHabits) : 0;
    this.currentStreak = this.calculateCurrentStreak();
  }
  checkStoredData(): void {
    console.log('=== Checking LocalStorage ===');
    console.log('currentUser:', localStorage.getItem('currentUser'));
    console.log('token:', localStorage.getItem('token'));
    console.log('token_exp:', localStorage.getItem('token_exp'));

    const userData = this.authService.getCurrentUserData();
    console.log('User data from AuthService:', userData);
  }

  getHabitProgressPercentage(habit: Habit): number {
    if (!habit.progress || habit.progress.length === 0) return 0;
    const completed = habit.progress.filter((p) => p.done).length;
    const total = habit.progress.length;
    return Math.round((completed / total) * 100);
  }

  calculateCurrentStreak(): number {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const hasActivity = this.habits.some((habit) =>
        habit.progress?.some((p) => {
          const progressDate = new Date(p.date);
          return progressDate.toDateString() === date.toDateString() && p.done;
        })
      );

      if (hasActivity) streak++;
      else break;
    }

    return streak;
  }

  getJoinedDate(): string {
    if (!this.user?.createdAt) return 'Unknown';
    return new Date(this.user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getMemberDuration(): string {
    if (!this.user?.createdAt) return '';
    const joinDate = new Date(this.user.createdAt);
    const today = new Date();
    const diffDays = Math.ceil(
      Math.abs(today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years !== 1 ? 's' : ''}${
        remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}` : ''
      }`;
    }
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  onPreferencesSave(): void {
    console.log('Saving preferences:', this.preferencesForm);
    setTimeout(() => {
      alert('Preferences saved successfully!');
    }, 500);
  }

  onLogout(): void {
    this.authService.logout();
  }

  onProfileAvatarClick(event: Event): void {
    event.stopPropagation();
    this.ui.toggleProfileMenu();
  }

  getTopHabits(): Habit[] {
    return this.habits
      .sort((a, b) => this.getHabitProgressPercentage(b) - this.getHabitProgressPercentage(a))
      .slice(0, 5);
  }

  getRecentActivity() {
    const allProgress = this.habits.flatMap((habit) =>
      (habit.progress || []).map((p) => ({
        ...p,
        habitTitle: habit.title,
        habitColor: habit.color,
      }))
    );

    return allProgress
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }
}
