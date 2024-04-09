import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelfieModalComponent } from './selfie-modal.component';

describe('SelfieModalComponent', () => {
  let component: SelfieModalComponent;
  let fixture: ComponentFixture<SelfieModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfieModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelfieModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
