import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoMethodPickerComponent } from './photo-method-picker.component';

describe('PhotoMethodPickerComponent', () => {
  let component: PhotoMethodPickerComponent;
  let fixture: ComponentFixture<PhotoMethodPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoMethodPickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoMethodPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
