import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from './core/navbar/navbar'
import { ReactiveFormsModule } from '@angular/forms';
import { Footer } from "./core/footer/footer";


@Component({
  selector: 'app-root',
   standalone: true,
  imports: [RouterOutlet, NavbarComponent, ReactiveFormsModule, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('habits-frontend');
}