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
import { MatDialog } from '@angular/material/dialog';
import { SelfieModalComponent } from '@cockpit/selfie-modal';

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

  // TODO: We don't need to separate these on mobile, just on web
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

  showEditModal$ = createEffect(
    () =>
      this._actions.pipe(
        ofType(selfieImageCapturedFromCamera, selfieImagePickedFromCallery),
        switchMap(({ photo }) =>
          from(fetch(photo.webPath!)).pipe(
            switchMap((response) =>
              from(response.blob()).pipe(
                tap((blob) =>
                  this._dialog.open(SelfieModalComponent, {
                    data: { src: blob, file: blob },
                  })
                )
              )
            )
          )
        )
      ),
    { dispatch: false }
  );

  // CODE to process a file
  //   return await new Promise<any>(async (resolve, reject) => {
  //   try {
  //   if (!this.mainUtil.isIOS) {
  //   await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
  //     result => console.log('Has permission?', result.hasPermission),
  //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
  // );
  // }
  // const options: CameraOptions = {
  //   quality: 100,
  //   destinationType: this.camera.DestinationType.FILE_URI,
  //   encodingType: this.camera.EncodingType.JPEG,
  //   mediaType: this.camera.MediaType.PICTURE,
  //   targetWidth: 1024,
  //   targetHeight: 1024,
  //   correctOrientation: true,
  //   // saveToPhotoAlbum: true
  // };
  // if (type === 'gallery') {
  //   options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
  //   options.saveToPhotoAlbum = false;
  //   options.destinationType = this.camera.DestinationType.DATA_URL;
  // }
  //
  // this.mainUtil.isLoading = { message: 'Loading image' };
  // let filePath = await this.camera.getPicture(options);
  // if (type !== 'gallery') {
  //   const currentName = filePath.substr(filePath.lastIndexOf('/') + 1);
  //   const correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
  //   const newEntry = await this.file.copyFile(correctPath, currentName, this.file.dataDirectory, `${new Date().getTime()}.jpg`);
  //   (newEntry as FileEntry).file(ourFile => {
  //     const reader = new FileReader();
  //     reader.onload = async () => {
  //       const blob = new Blob([reader.result], {
  //         type: ourFile.type
  //       });
  //       this.ngZone.run(async () => {
  //         this.mainUtil.isLoading = { message: 'Loading image' };
  //         const result = await this.cropImage(blob);
  //         if (result === 'retake') {
  //           const retake = await this.getPhoto(type);
  //           resolve(retake);
  //         }
  //
  //         if (result) {
  //           this.mainUtil.saveImageAndroidFile(ourFile, type);
  //           resolve(result);
  //         }
  //       });
  //     };
  //     reader.onerror = (err) => {
  //       this.mainUtil.showSnackbar('Error occurred while loading selfie. Please try again.', 2000);
  //       this.mainUtil.isLoading = false;
  //       console.log(err);
  //       resolve(null);
  //     };
  //     reader.readAsArrayBuffer(ourFile);
  //   }, (err) => {
  //     this.mainUtil.showSnackbar('Error occurred while loading selfie. Please try again.', 2000);
  //     this.mainUtil.isLoading = false;
  //     console.log(err);
  //     resolve(null);
  //   });
  // } else {
  //   const base64Response = await fetch(`data:image/jpeg;base64,${filePath}`);
  //   const blob = await base64Response.blob();
  //
  //   this.ngZone.run(async () => {
  //     this.mainUtil.isLoading = { message: 'Loading image' };
  //     const result = await this.cropImage(blob);
  //     if (result === 'retake') {
  //       const retake = await this.getPhoto(type);
  //       resolve(retake);
  //     }
  //
  //     if (result) {
  //       resolve(result);
  //     }
  //   });
  // }
  // } catch (error) {
  //   this.mainUtil.showSnackbar('Error occurred while loading image. Please try again.', 2000);
  //   this.mainUtil.isLoading = false;
  //   console.log(error);
  //   resolve(null);
  // }
  // });

  constructor(
    private readonly _actions: Actions,
    private readonly _bottomSheet: MatBottomSheet,
    private readonly _dialog: MatDialog
  ) {}
}
