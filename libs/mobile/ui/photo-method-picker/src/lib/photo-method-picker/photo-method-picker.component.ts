import { Component, Inject } from '@angular/core';
import { MatNavList } from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'cockpit-photo-method-picker',
  standalone: true,
  imports: [MatNavList, MatDivider],
  templateUrl: './photo-method-picker.component.html',
  styleUrl: './photo-method-picker.component.scss',
})
export class PhotoMethodPickerComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { title: string },
    private bottomSheetRef: MatBottomSheetRef<PhotoMethodPickerComponent>
  ) {}

  choose(ev: Event, type: 'camera' | 'gallery') {
    ev.preventDefault();
    this.bottomSheetRef.dismiss({ type });
  }
}
