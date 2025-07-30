import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentEventPageComponent } from './current-event-page.component';

describe('CurrentEventPageComponent', () => {
  let component: CurrentEventPageComponent;
  let fixture: ComponentFixture<CurrentEventPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentEventPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentEventPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
