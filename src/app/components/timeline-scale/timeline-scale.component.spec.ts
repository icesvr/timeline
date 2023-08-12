import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineScaleComponent } from './timeline-scale.component';

describe('TimelineScaleComponent', () => {
  let component: TimelineScaleComponent;
  let fixture: ComponentFixture<TimelineScaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineScaleComponent]
    });
    fixture = TestBed.createComponent(TimelineScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
