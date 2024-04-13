import { createAction, props } from '@ngrx/store';
import { PhotoInfo } from '@cockpit/mobile/data-models';

export const selfieRequested = createAction(
  '[Selfies] Selfie Requested',
  props<{ title?: string; id: number; image_type: 'selfie' }>()
);
export const selfieMethodPickedCamera = createAction(
  `[Selfies] Selfie Method Picked Camera`,
  props<{ id: number; image_type: 'selfie' }>()
);
export const selfieMethodPickedGallery = createAction(
  `[Selfies] Selfie Method Picked Gallery`,
  props<{ id: number; image_type: 'selfie' }>()
);
export const selfieImageCapturedFromCamera = createAction(
  '[Selfies] Selfie Image Captured From Camera',
  props<{
    photo: PhotoInfo;
    id: number;
    image_type: 'selfie';
  }>()
);
export const selfieImagePickedFromCallery = createAction(
  '[Selfies] Selfie Image Picked From Gallery',
  props<{ photo: PhotoInfo; id: number; image_type: 'selfie' }>()
);
export const photoCropped = createAction(
  '[Selfies] Photo Cropped',
  props<{ photo: Blob; id: number; image_type: 'selfie' }>()
);
export const selfieUploaded = createAction(
  '[Selfies] Selfie Uploaded',
  props<{ id: number; link: string }>()
);
