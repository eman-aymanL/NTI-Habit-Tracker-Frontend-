import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitPopup } from './habit-popup';

describe('HabitPopup', () => {
  let component: HabitPopup;
  let fixture: ComponentFixture<HabitPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
