import { Routes } from '@angular/router';
import { HabitListComponent } from './habits/habit-list/habit-list';
import { HabitDetail } from './habits/habit-detail/habit-detail';
import { Profile } from './profile/profile';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { HabitFormComponent } from './habits/habit-form/habit-form';

export const routes: Routes = [
  { path: 'habits', component: HabitListComponent,},
  { path: 'habits/new', component: HabitFormComponent,},
  { path: 'habits/:id/edit', component: HabitFormComponent,},
  { path: 'habits/:id', component: HabitDetail},
  { path: 'profile', component: Profile},
  { path: 'login', component: Login},
  { path: 'register', component: Register},
  { path: '', redirectTo: 'habits', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'habits' }
];