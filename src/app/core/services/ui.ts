import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiService {
  private profileMenuToggleSubject = new Subject<'toggle' | 'open' | 'close'>();
  profileMenuToggle$ = this.profileMenuToggleSubject.asObservable();

  toggleProfileMenu() {
    this.profileMenuToggleSubject.next('toggle');
  }
  openProfileMenu() {
    this.profileMenuToggleSubject.next('open');
  }
  closeProfileMenu() {
    this.profileMenuToggleSubject.next('close');
  }
}
