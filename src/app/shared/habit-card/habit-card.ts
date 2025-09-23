import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Habit, Progress } from '../../models/habit';

@Component({
  selector: 'app-habit-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './habit-card.html',
  styleUrls: ['./habit-card.css'],
})
export class HabitCard {
  // Inputs
  @Input() habit?: Habit;
  @Input() compact: boolean = false; // smaller density variant
  @Input() showActions: boolean = true; // hide action buttons if false

  // Outputs
  @Output() toggleToday = new EventEmitter<Habit>();
  @Output() edit = new EventEmitter<Habit>();
  @Output() remove = new EventEmitter<Habit>();
  @Output() archiveToggle = new EventEmitter<Habit>();

  private toDate(d?: Date | string): Date | undefined {
    if (!d) return undefined;
    return d instanceof Date ? d : new Date(d);
  }

  private sameDay(a?: Date | string, b?: Date | string): boolean {
    const da = this.toDate(a);
    const db = this.toDate(b);
    if (!da || !db) return false;
    return (
      da.getFullYear() === db.getFullYear() &&
      da.getMonth() === db.getMonth() &&
      da.getDate() === db.getDate()
    );
  }

  get today(): Date {
    return new Date();
  }

  get isDoneToday(): boolean {
    const prog = this.habit?.progress || [];
    return prog.some((p) => this.sameDay(p.date, this.today) && !!p.done);
  }

  get completedCount(): number {
    return (this.habit?.progress || []).filter((p) => p.done).length;
  }

  get totalTracked(): number {
    return (this.habit?.progress || []).length;
  }

  get completionPercent(): number {
    const total = this.totalTracked;
    if (!total) return 0;
    return Math.round((this.completedCount / total) * 100);
  }

  get streak(): number {
    const progress = [...(this.habit?.progress || [])]
      .filter((p) => !!p.date)
      .sort((a, b) => this.toDate(b.date)!.getTime() - this.toDate(a.date)!.getTime());

    let count = 0;
    let day = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());

    // Walk backwards day by day; increase streak while done entries exist for each day
    while (true) {
      const entry = progress.find((p) => this.sameDay(p.date, day));
      if (entry?.done) {
        count++;
        // previous day
        day = new Date(day);
        day.setDate(day.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  }

  get frequencyLabel(): string {
    const f = this.habit?.frequency;
    if (!f) return '—';
    if (f === 'daily') return 'Daily';
    if (f === 'weekly') return 'Weekly';
    return 'Custom';
  }

  onToggleToday() {
    if (!this.habit) return;
    this.toggleToday.emit(this.habit);
  }

  onEdit() {
    if (!this.habit) return;
    this.edit.emit(this.habit);
  }

  onRemove() {
    if (!this.habit) return;
    this.remove.emit(this.habit);
  }

  onArchiveToggle() {
    if (!this.habit) return;
    this.archiveToggle.emit(this.habit);
  }
}
