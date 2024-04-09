import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, from, map, switchMap, tap } from 'rxjs';
import {
  selfieImageCapturedFromCamera,
  selfieImagePickedFromCallery,
  selfieMethodPickedCamera,
  selfieMethodPickedGallery,
  selfieRequested,
} from '@cockpit/selfies-state';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PhotoMethodPickerComponent } from '@cockpit/photo-method-picker';
import { Camera, CameraResultType } from '@capacitor/camera';

@Injectable()
export class SelfiesEffects {
  requestSelfie$ = createEffect(
    () =>
      this._actions.pipe(
        ofType(selfieRequested),
        tap(({ title }) =>
          this._bottomSheet.open(PhotoMethodPickerComponent, {
            data: { title },
          })
        )
      ),
    { dispatch: false }
  );

  pickFromGallery$ = createEffect(() =>
    this._actions.pipe(
      ofType(selfieMethodPickedGallery),
      switchMap(() =>
        from(
          Camera.pickImages({
            quality: 50,
            correctOrientation: true,
            limit: 1,
            height: 1024,
            width: 1024,
          })
        ).pipe(
          filter(({ photos }) => photos.length > 0),
          map(({ photos }) => photos[0]),
          tap((photo) => console.log(photo)),
          map((photo) =>
            selfieImagePickedFromCallery({
              photo: {
                saved: false,
                format: photo.format,
                path: photo.path!,
                webPath: photo.webPath,
              },
            })
          )
        )
      )
    )
  );

  takePhoto$ = createEffect(() =>
    this._actions.pipe(
      ofType(selfieMethodPickedCamera),
      switchMap(() =>
        from(
          Camera.getPhoto({
            quality: 50,
            correctOrientation: true,
            resultType: CameraResultType.Uri,
            height: 1024,
            width: 1024,
          })
        ).pipe(
          tap((photo) => console.log(photo)),
          map((photo) =>
            selfieImageCapturedFromCamera({
              photo: {
                saved: photo.saved,
                format: photo.format,
                path: photo.path!,
                webPath: photo.webPath!,
              },
            })
          )
        )
      )
    )
  );

  constructor(
    private readonly _actions: Actions,
    private readonly _bottomSheet: MatBottomSheet
  ) {}
}
