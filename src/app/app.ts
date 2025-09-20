import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './core/navbar/navbar';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // <-- اضيفي هذا
import { CommonModule } from '@angular/common'; // <-- اضيفي هذا

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
    ReactiveFormsModule,
    HttpClientModule,    // <-- اضيفي هذا
    CommonModule         // <-- اضيفي هذا
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('habits-frontend');
}