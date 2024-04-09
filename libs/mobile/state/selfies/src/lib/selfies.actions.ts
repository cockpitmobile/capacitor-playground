import { createAction, props } from '@ngrx/store';
import { PhotoInfo } from '@cockpit/data-models';

export const selfieRequested = createAction(
  '[Selfies] Selfie Requested',
  props<{ title?: string }>()
);
export const selfieMethodPickedCamera = createAction(
  `[Selfies] Selfie Method Picked Camera`
);
export const selfieMethodPickedGallery = createAction(
  `[Selfies] Selfie Method Picked Gallery`
);
export const selfieImageCapturedFromCamera = createAction(
  '[Selfies] Selfie Image Captured From Camera',
  props<{
    photo: PhotoInfo;
  }>()
);
export const selfieImagePickedFromCallery = createAction(
  '[Selfies] Selfie Image Picked From Gallery',
  props<{ photo: PhotoInfo }>()
);
