import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './core/navbar/navbar';
import { ReactiveFormsModule } from '@angular/forms';
import { Footer } from "./core/footer/footer";

import { HttpClientModule } from '@angular/common/http';   
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
    ReactiveFormsModule,
    HttpClientModule,     
    CommonModule,
    Footer      
  ],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('habits-frontend');
}