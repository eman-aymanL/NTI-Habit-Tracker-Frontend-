import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/navbar/navbar';
import { ReactiveFormsModule } from '@angular/forms';
import { Footer } from './core/footer/footer';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ReactiveFormsModule, Footer, FontAwesomeModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('habits-frontend');

  constructor(library: FaIconLibrary, public auth: AuthService) {
    // Register the full solid icon pack so we can use tuple syntax ['fas', iconName]
    library.addIconPacks(fas);
  }
}
