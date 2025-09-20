import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navbar} from './core/navbar/navbar'
import { ReactiveFormsModule } from '@angular/forms';
import { Footer } from "./core/footer/footer";


@Component({
  selector: 'app-root',
   standalone: true,
  imports: [RouterOutlet, Navbar, ReactiveFormsModule, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('habits-frontend');
}
