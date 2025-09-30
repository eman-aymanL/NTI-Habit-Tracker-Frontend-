import { Routes } from '@angular/router';
import { HabitList } from './habits/habit-list/habit-list';
import { HabitDetail } from './habits/habit-detail/habit-detail';
import { Profile } from './profile/profile';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { HabitFormComponent } from './habits/habit-form/habit-form';
import { VerifyEmail } from './auth/verify-email/verify-email';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './auth/reset-password/reset-password';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { ProgressTracker } from './progress-tracker/progress-tracker';

export const routes: Routes = [
  { path: 'habits', component: HabitList, canActivate: [authGuard] },
  { path: 'habits/new', component: HabitFormComponent, canActivate: [authGuard] },
  { path: 'habits/:id/edit', component: HabitFormComponent, canActivate: [authGuard] },
  { path: 'habits/:id', component: HabitDetail, canActivate: [authGuard] },
  { path: 'calendar', component: ProgressTracker, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'auth/login', component: Login, canActivate: [guestGuard] },
  { path: 'auth/register', component: Register, canActivate: [guestGuard] },
  { path: 'verify-email/:token', component: VerifyEmail },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/reset-password/:token', component: ResetPasswordComponent },
  { path: '', redirectTo: 'habits', pathMatch: 'full' },
  // { path: '**', redirectTo: 'habits' }
];
