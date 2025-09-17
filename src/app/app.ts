import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navbar} from './core/navbar/navbar'
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
   standalone: true,
  imports: [RouterOutlet ,Navbar ,ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('habits-frontend');
}
