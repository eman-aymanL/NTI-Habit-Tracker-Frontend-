import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitDetail } from './habit-detail';

describe('HabitDetail', () => {
  let component: HabitDetail;
  let fixture: ComponentFixture<HabitDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
