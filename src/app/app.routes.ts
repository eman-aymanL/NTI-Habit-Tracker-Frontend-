import { Routes } from '@angular/router';
import { Habits } from './habits/habits'
import { Profile } from './profile//profile'
import { Login } from './auth/login/login'
import { Register } from './auth/register/register'



export const routes: Routes = [
    { path: 'habits', component: Habits },
  { path: 'profile', component: Profile },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '', redirectTo: 'habits', pathMatch: 'full' }
];
