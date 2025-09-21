import { Routes } from '@angular/router';
import { HabitListComponent } from './habits/habit-list/habit-list';
import { HabitDetail } from './habits/habit-detail/habit-detail';
import { Profile } from './profile/profile';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { HabitFormComponent } from './habits/habit-form/habit-form';
import { VerifyEmail } from './auth/verify-email/verify-email';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './auth/reset-password/reset-password';


export const routes: Routes = [
  { path: 'habits', component: HabitListComponent,},
  { path: 'habits/new', component: HabitFormComponent,},
  { path: 'habits/:id/edit', component: HabitFormComponent,},
  { path: 'habits/:id', component: HabitDetail},
  { path: 'profile', component: Profile},
  { path: 'auth/login', component: Login },
{ path: 'auth/register', component: Register },
 { path: 'verify-email/:token', component: VerifyEmail },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/reset-password/:token', component: ResetPasswordComponent },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  // { path: '**', redirectTo: 'habits' }
];
