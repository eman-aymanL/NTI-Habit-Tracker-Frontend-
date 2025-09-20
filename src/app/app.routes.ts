import { Routes } from '@angular/router';
import { Habits } from './habits/habits';
import { Profile } from './profile//profile';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { VerifyEmail } from './auth/verify-email/verify-email';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './auth/reset-password/reset-password';
export const routes: Routes = [
  { path: 'habits', component: Habits },
  { path: 'profile', component: Profile },
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Register },
  { path: 'verify-email/:token', component: VerifyEmail },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/reset-password/:token', component: ResetPasswordComponent }, // Changed from auth/reset-password
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
];
