import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-view.html',
  styleUrls: ['./calendar-view.css'],
})
export class CalendarView {
  // Month is 0-based like JS Date
  @Input() month!: number; // 0-11
  @Input() year!: number; // full year
  // Dates that should be shaded (done days). Accept strings or Date objects
  @Input() doneDates: Array<string | Date> = [];
  @Input() highlightToday: boolean = true;

  @Output() monthChanged = new EventEmitter<{ month: number; year: number }>();
  @Output() dateSelected = new EventEmitter<Date>();

  weeks: Array<Array<{ date: Date; inMonth: boolean; done: boolean; isToday: boolean }>> = [];
  get monthLabel(): string {
    const d = new Date(
      this.year ?? new Date().getFullYear(),
      this.month ?? new Date().getMonth(),
      1
    );
    return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  }

  ngOnChanges() {
    this.buildCalendar();
  }

  private toDate(d: string | Date): Date {
    return d instanceof Date ? d : new Date(d);
  }

  private sameDay(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  private isDone(date: Date): boolean {
    return this.doneDates.some((d) => this.sameDay(this.toDate(d), date));
  }

  private startOfMonth(y: number, m: number) {
    return new Date(y, m, 1);
  }

  private endOfMonth(y: number, m: number) {
    return new Date(y, m + 1, 0);
  }

  private buildCalendar() {
    if (this.month == null || this.year == null) {
      const today = new Date();
      this.month = today.getMonth();
      this.year = today.getFullYear();
    }

    const start = this.startOfMonth(this.year, this.month);
    const end = this.endOfMonth(this.year, this.month);
    const startDay = start.getDay(); // 0 Sun - 6 Sat

    const gridStart = new Date(start);
    gridStart.setDate(start.getDate() - startDay);

    const totalCells = 42; // 6 weeks * 7 days
    const today = new Date();
    const weeks: any[] = [];
    let row: any[] = [];

    for (let i = 0; i < totalCells; i++) {
      const current = new Date(gridStart);
      current.setDate(gridStart.getDate() + i);
      const inMonth = current.getMonth() === this.month;
      const done = this.isDone(current);
      const isToday = this.highlightToday && this.sameDay(current, today);
      row.push({ date: current, inMonth, done, isToday });
      if (row.length === 7) {
        weeks.push(row);
        row = [];
      }
    }
    this.weeks = weeks;
  }

  prevMonth() {
    let m = this.month - 1;
    let y = this.year;
    if (m < 0) {
      m = 11;
      y--;
    }
    this.month = m;
    this.year = y;
    this.buildCalendar();
    this.monthChanged.emit({ month: this.month, year: this.year });
  }

  nextMonth() {
    let m = this.month + 1;
    let y = this.year;
    if (m > 11) {
      m = 0;
      y++;
    }
    this.month = m;
    this.year = y;
    this.buildCalendar();
    this.monthChanged.emit({ month: this.month, year: this.year });
  }

  selectDate(d: Date) {
    this.dateSelected.emit(d);
  }
}
