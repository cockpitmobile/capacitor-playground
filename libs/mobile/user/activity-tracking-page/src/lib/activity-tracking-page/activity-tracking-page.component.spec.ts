import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityTrackingPageComponent } from './activity-tracking-page.component';

describe('ActivityTrackingPageComponent', () => {
  let component: ActivityTrackingPageComponent;
  let fixture: ComponentFixture<ActivityTrackingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityTrackingPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityTrackingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
