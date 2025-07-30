import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventSelectionListPageComponent } from './event-selection-list-page.component';

describe('EventSelectionListPageComponent', () => {
  let component: EventSelectionListPageComponent;
  let fixture: ComponentFixture<EventSelectionListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSelectionListPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventSelectionListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
