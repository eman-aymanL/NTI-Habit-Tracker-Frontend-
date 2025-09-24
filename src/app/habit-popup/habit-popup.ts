import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Habit } from '../models/habit';
import { HabitService } from '../services/habit';
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
  selector: 'app-habit-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './habit-popup.html',
  styleUrls: ['./habit-popup.css']
})
export class HabitPopupComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() habitCreated = new EventEmitter<Habit>();

  habit: any = {
    title: '',
    description: '',
    frequency: 'daily',
    color: '#4caf50',
    startDate: '',
    endDate: '',
    reminderTime: '',
    icon: 'faBullseye'
  };

  iconOptions = [
    { label: 'Water', icon: faGlassWater, iconName: 'faGlassWater' },
    { label: 'Exercise', icon: faDumbbell, iconName: 'faDumbbell' },
    { label: 'Sleep', icon: faMoon, iconName: 'faMoon' },
    { label: 'Healthy Eating', icon: faAppleWhole, iconName: 'faAppleWhole' },
    { label: 'Yoga / Stretch', icon: faPersonPraying, iconName: 'faPersonPraying' },
    { label: 'Reading', icon: faBookOpen, iconName: 'faBookOpen' },
    { label: 'Learning', icon: faGraduationCap, iconName: 'faGraduationCap' },
    { label: 'Meditation', icon: faSpa, iconName: 'faSpa' },
    { label: 'Journaling', icon: faPenNib, iconName: 'faPenNib' },
    { label: 'Puzzles', icon: faPuzzlePiece, iconName: 'faPuzzlePiece' },
    { label: 'Planning', icon: faCalendarCheck, iconName: 'faCalendarCheck' },
    { label: 'Focus', icon: faBullseye, iconName: 'faBullseye' },
    { label: 'Less Social Media', icon: faMobileScreen, iconName: 'faMobileScreen' },
    { label: 'Tidy Workspace', icon: faBroom, iconName: 'faBroom' },
    { label: 'Prayer / Worship', icon: faHandsPraying, iconName: 'faHandsPraying' },
    { label: 'Read Quran', icon: faBook, iconName: 'faBook' },
    { label: 'Gratitude', icon: faHeart, iconName: 'faHeart' },
    { label: 'Helping Others', icon: faHandHoldingHeart, iconName: 'faHandHoldingHeart' },
    { label: 'Call Family/Friends', icon: faPhone, iconName: 'faPhone' },
    { label: 'Give Compliment', icon: faFaceSmile, iconName: 'faFaceSmile' },
    { label: 'Meet New Person', icon: faUserPlus, iconName: 'faUserPlus' },
    { label: 'Morning Water', icon: faMugHot, iconName: 'faMugHot' },
    { label: 'One Page Read', icon: faFileLines, iconName: 'faFileLines' },
    { label: 'Small Daily Goal', icon: faListCheck, iconName: 'faListCheck' },
    { label: '5 min Stretch', icon: faPersonWalking, iconName: 'faPersonWalking' },
    { label: 'Clean One Spot', icon: faSprayCan, iconName: 'faSprayCan' },
    { label: 'Car / Driving', icon: faCar, iconName: 'faCar' }
  ];

  daysOfWeek = [
    { name: 'Monday', value: 'monday', selected: false },
    { name: 'Tuesday', value: 'tuesday', selected: false },
    { name: 'Wednesday', value: 'wednesday', selected: false },
    { name: 'Thursday', value: 'thursday', selected: false },
    { name: 'Friday', value: 'friday', selected: false },
    { name: 'Saturday', value: 'saturday', selected: false },
    { name: 'Sunday', value: 'sunday', selected: false }
  ];

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private habitService: HabitService) {}

  onFrequencyChange(): void {
    if (this.habit.frequency !== 'custom') {
      this.daysOfWeek.forEach(day => day.selected = false);
    }
  }

  toggleDaySelection(day: any): void {
    day.selected = !day.selected;
  }

  onSubmit(): void {
    if (!this.habit.title) {
      this.errorMessage = 'Title is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const habitData: any = {
      title: this.habit.title,
      description: this.habit.description || '',
      frequency: this.habit.frequency,
      color: this.habit.color,
      icon: this.habit.icon, 
      startDate: this.habit.startDate,
      endDate: this.habit.endDate,
      reminderTime: this.habit.reminderTime
    };

    if (this.habit.frequency === 'custom') {
      const selectedDays = this.daysOfWeek
        .filter(day => day.selected)
        .map(day => day.value);
      
      if (selectedDays.length === 0) {
        this.errorMessage = 'Please select at least one day for custom frequency';
        this.isLoading = false;
        return;
      }
      
      habitData.customDays = selectedDays;
    }

    this.habitService.createHabit(habitData).subscribe({
      next: (newHabit) => {
        this.isLoading = false;
        this.successMessage = 'Habit created successfully!';
        
        this.resetForm();
        
        setTimeout(() => {
          this.habitCreated.emit(newHabit);
          this.closePopup();
        }, 1000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to create habit. Please try again.';
        console.error('Error creating habit:', error);
      }
    });
  }

  closePopup(): void {
    this.close.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.habit = {
      title: '',
      description: '',
      frequency: 'daily',
      color: '#4caf50',
      startDate: '',
      endDate: '',
      reminderTime: '',
      icon: 'faBullseye'
    };
    this.daysOfWeek.forEach(day => day.selected = false);
    this.errorMessage = '';
    this.successMessage = '';
  }
}