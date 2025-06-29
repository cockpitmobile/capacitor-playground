import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  ImageCropperModule,
  LoadedImage,
} from 'ngx-image-cropper';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'cockpit-selfie-modal',
  standalone: true,
  imports: [
    CommonModule,
    ImageCropperModule,
    MatButton,
  ],
  templateUrl: './selfie-modal.component.html',
  styleUrl: './selfie-modal.component.scss',
})
export class SelfieModalComponent {
  croppedImage?: string;
  croppedBlob?: Blob;

  savedImage?: string;
  cropImage = true;
  styleImage = false;
  styled = false;
  @ViewChild(ImageCropperComponent, { static: false })
  imageCropper?: ImageCropperComponent;
  @ViewChild('imageCanvas', { static: false }) imageCanvas: any;
  @ViewChild('frameCanvas', { static: false }) frameCanvas: any;
  @ViewChild('drawingCanvas', { static: false }) drawingCanvas: any;
  lastX?: number;
  lastY?: number;
  brushColor = 'blue';
  frameChecked = true;
  width?: string;
  selfieFilterWidth?: string;
  height?: string;
  // logo: string = Images.RunAcrossAmericaLogoLeftAlign;
  showPicker?: boolean;
  isDistance?: boolean;
  undoList: any[] = [];
  distanceUnits = 'Km';
  file?: any;
  selfieFilterURLs: Array<string> = [];
  selfieFilterIndex = 0;
  savedFile?: Blob;

  constructor(
    public dialog: MatDialogRef<SelfieModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { src: any; file: any },
    private changeDetector: ChangeDetectorRef
    // private userService: UserService,
    // public mainUtil: MainUtil,
  ) {}

  ngOnInit() {
    this.savedImage = this.data.src;
    this.file = this.data.file;
    this.width = window.innerWidth - 27 + 'px';
    this.selfieFilterWidth = window.innerWidth - 25 + 'px';
    this.height = window.innerHeight - 130 + 'px';

    // if (
    //   !this.data.challenge &&
    //   this.data.project &&
    //   this.data.project.challenges &&
    //   !this.data.project.config.hide_challenges
    // ) {
    //   const activeChallenge = this.mainUtil.getChallengeActive(
    //     this.data.project
    //   );
    //
    //   if (
    //     activeChallenge &&
    //     activeChallenge[0] &&
    //     activeChallenge[0].isActive &&
    //     activeChallenge[0].isVisible &&
    //     activeChallenge[0].challenge_type !== 'single'
    //   ) {
    //     this.data.challenge = activeChallenge[0];
    //   }
    //   if (
    //     activeChallenge &&
    //     activeChallenge[1] &&
    //     activeChallenge[1].isActive &&
    //     activeChallenge[1].isVisible &&
    //     activeChallenge[1].challenge_type !== 'single' &&
    //     activeChallenge[1].selfie_filter_image_link
    //   ) {
    //     this.selfieFilterURLs.push(activeChallenge[1].selfie_filter_image_link);
    //   }
    // }

    // if (this.data.eventResult) {
    //   if (this.data.project) {
    //     this.isDistance =
    //       (this.data.challenge &&
    //         this.data.challenge &&
    //         this.data.challenge.challenge_type === 'cumulative') ||
    //       (!this.data.challenge &&
    //         this.data.project.race_event_type === 'cumulative')
    //         ? this.data.distance
    //         : false;
    //   }
    //   if (this.userService.currentUser.worker_projects.length) {
    //     if (
    //       this.data.challenge &&
    //       this.data.challenge.selfie_filter_image_link
    //     ) {
    //       this.selfieFilterURLs.push(
    //         this.data.challenge.selfie_filter_image_link
    //       );
    //     }
    //     if (
    //       this.data.project &&
    //       this.data.project.project_selfie_filter_image_link
    //     ) {
    //       this.selfieFilterURLs.push(
    //         this.data.project.project_selfie_filter_image_link
    //       );
    //     } else {
    //       const project = this.userService.currentUser.worker_projects.find(
    //         (x) =>
    //           new Date(x.ProjectParticipant.cohort_start_date) < new Date() &&
    //           new Date(x.ProjectParticipant.cohort_end_date) > new Date()
    //       );
    //       if (project && project.project_selfie_filter_image_link) {
    //         this.selfieFilterURLs.push(
    //           project.project_selfie_filter_image_link
    //         );
    //       }
    //     }
    //   }
    //   this.selfieFilterURLs.push('../../../assets/selfieOverlay.png');
    //
    //   if (
    //     this.data.project &&
    //     this.data.project.race_event_type !== 'cumulative'
    //   ) {
    //     this.data.distance = this.data.eventResult.distance_ran;
    //     this.distanceUnits =
    //       this.data.eventResult.distance_units === 'Kilometers' ? 'Km' : 'Mi';
    //   } else if (this.data.distanceUnits) {
    //     this.distanceUnits =
    //       this.data.distanceUnits === 'Kilometers' ? 'Km' : 'Mi';
    //   }
    // }
  }

  async crop() {
    const croppedImage = await this.imageCropper?.crop();

    this.croppedImage = croppedImage!.objectUrl!;
    this.croppedBlob = croppedImage!.blob!;

    setTimeout(() => this.submit(), 3000);
  }

  // incrementSelfieFilter(index: number) {
  //   if (
  //     this.selfieFilterIndex + index > -1 &&
  //     this.selfieFilterIndex + index < this.selfieFilterURLs.length
  //   ) {
  //     this.selfieFilterIndex += index;
  //   } else if (this.selfieFilterIndex + index < 0) {
  //     this.selfieFilterIndex = this.selfieFilterURLs.length - 1;
  //   } else {
  //     this.selfieFilterIndex = 0;
  //   }
  //   this.frameChecked = false;
  //   this.addLogo('frame');
  // }

  loadImageFailed() {
    // this.mainUtil.isLoading = false;
  }

  cropperReady() {}

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64!;
  }

  imageLoaded(event: LoadedImage) {
    // this.mainUtil.isLoading = false;
  }

  async switchButton() {
    if (this.cropImage === true) {
      this.croppedImage = this.imageCropper!.crop()!.base64!;
      this.savedImage = this.croppedImage;
      this.styled = true;
      this.styleImage = true;
      this.cropImage = false;
      this.changeDetector.detectChanges();
      this.importImage();
      this.frameChecked = true;
      // setTimeout(() => {
      //   this.addLogo();
      // }, 50);
    } else {
      this.styleImage = false;
      this.cropImage = true;
      this.savedImage = this.data.src;
    }
  }

  importImage(reset = false) {
    const imageCanvas = this.imageCanvas.nativeElement as HTMLCanvasElement;
    const drawingCanvas = this.drawingCanvas.nativeElement as HTMLCanvasElement;
    const frameCanvas = this.frameCanvas.nativeElement as HTMLCanvasElement;

    const ctx = imageCanvas.getContext('2d');
    const image = new Image();
    if (reset) {
      image.src = this.croppedImage!;
    } else {
      image.src = this.savedImage!;
    }

    image.onload = () => {
      imageCanvas.width = image.width;
      imageCanvas.height = image.height;
      drawingCanvas.width = drawingCanvas.offsetWidth;
      drawingCanvas.height = drawingCanvas.offsetHeight;
      frameCanvas.width = 850;
      frameCanvas.height = 850;
      ctx!.drawImage(image, 0, 0);
    };
    image.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  undoLastDrawing() {
    const canvas = this.drawingCanvas.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (this.undoList.length) {
      const beforeLastDrawing = this.undoList.pop();
      const image = new Image();
      image.src = beforeLastDrawing!;
      image.onload = () => {
        ctx!.clearRect(0, 0, canvas.width, canvas.height);
        ctx!.drawImage(image, 0, 0);
      };
      image.onerror = (error) => {
        console.log('Error: ' + error);
      };
    }
  }

  saveLastDrawing() {
    const canvas = this.drawingCanvas.nativeElement as HTMLCanvasElement;
    this.undoList.push(canvas.toDataURL());
  }

  startDrawing(event: any) {
    this.saveLastDrawing();
    const canvas = this.drawingCanvas.nativeElement as HTMLCanvasElement;
    const canvasPosition = canvas.getBoundingClientRect() as DOMRect;
    const ctx = canvas.getContext('2d');
    this.lastX = event.touches[0].pageX - canvasPosition.x;
    this.lastY = event.touches[0].pageY - canvasPosition.y;

    // Draw a circle at the position tapped on screen
    ctx!.fillStyle = this.brushColor;
    ctx!.beginPath();
    ctx!.arc(this.lastX, this.lastY, 2.5, 0, 2 * Math.PI, true);
    ctx!.fill();
  }

  moveDrawing(event: any) {
    const canvas = this.drawingCanvas.nativeElement as HTMLCanvasElement;
    const canvasPosition = canvas.getBoundingClientRect() as DOMRect;
    const currentX = event.touches[0].pageX - canvasPosition.x;
    const currentY = event.touches[0].pageY - canvasPosition.y;
    const ctx = canvas.getContext('2d');

    ctx!.lineJoin = 'round';
    ctx!.strokeStyle = this.brushColor;
    ctx!.lineWidth = 5;

    ctx!.beginPath();
    ctx!.moveTo(this.lastX!, this.lastY!);
    ctx!.lineTo(currentX, currentY);
    ctx!.closePath();
    ctx!.stroke();

    this.lastX = currentX;
    this.lastY = currentY;
  }

  // async addLogo(type?: string, convertCanvasToURL = false) {
  //   switch (type) {
  //     case 'frame':
  //       this.frameChecked = !this.frameChecked;
  //       break;
  //     case 'distance':
  //       this.isDistance = !this.isDistance;
  //       break;
  //   }
  //   const canvas = this.frameCanvas.nativeElement as HTMLCanvasElement;
  //   const ctx = canvas.getContext('2d');
  //   this.clearCanvas(this.frameCanvas);
  //   if (this.frameChecked) {
  //     return await new Promise(async (resolve, reject) => {
  //       const selfieFilter = this.selfieFilterURLs[this.selfieFilterIndex];
  //       if (selfieFilter) {
  //         const text = this.isDistance
  //           ? `${Math.round(this.data.distance * 10) / 10} ${this.distanceUnits}`
  //           : this.data.time;
  //         const image = new Image();
  //         image.crossOrigin = '*';
  //         image.src = selfieFilter + '?' + new Date().getTime();
  //         image.onload = () => {
  //           ctx.drawImage(image, 0, 0, canvas.width, canvas.width);
  //           if (text.length > 7) {
  //             ctx.font = '42px Miriam Libre';
  //           } else {
  //             ctx.font = '52px Miriam Libre';
  //           }
  //
  //           ctx.fillStyle = 'white';
  //           ctx.textAlign = 'center';
  //           const x = canvas.width - 125;
  //           const y = text.length > 7 ? 73 : 78;
  //           ctx.fillText(text, x, y);
  //           resolve(true);
  //         };
  //         image.onerror = (error) => {
  //           resolve(false);
  //         };
  //       } else {
  //         const text = this.isDistance
  //           ? `${this.data.distance.toFixed(2).substring(0, this.data.distance.toFixed(2).length - 1)} ${this.distanceUnits}`
  //           : this.data.time;
  //         if (text.length > 7) {
  //           ctx.font = '42px Miriam Libre';
  //         } else {
  //           ctx.font = '52px Miriam Libre';
  //         }
  //
  //         ctx.fillStyle = 'white';
  //         ctx.textAlign = 'center';
  //         const x = canvas.width - 125;
  //         const y = text.length > 7 ? 73 : 78;
  //         ctx.fillText(text, x, y);
  //         resolve(true);
  //       }
  //     });
  //   }
  // }

  changeBrushColor(color: any) {
    this.brushColor = color;
    this.showPicker = false;
  }

  clearCanvas(canvasType: any) {
    const canvas = canvasType.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    switch (canvasType) {
      case this.frameCanvas:
        ctx!.clearRect(0, 0, canvas.width, canvas.height);
        break;
      case this.drawingCanvas:
        this.undoList = [];
        ctx!.clearRect(0, 0, canvas.width, canvas.height);
        break;
    }
  }

  cancel() {
    this.dialog.close(null);
  }

  retake() {
    this.dialog.close('retake');
  }

  endDrawing($event: any) {}

  async setSavedImage() {
    await new Promise((resolve, reject) => {
      if (this.imageCropper) {
        this.savedImage = this.imageCropper.crop()!.base64!;

        const image = new Image();
        image.src = this.savedImage!;
        image.onerror = (error) => {
          resolve(null);
        };
        image.onload = async () => {
          const canvas = document.createElement('canvas');
          const context = (canvas as HTMLCanvasElement).getContext('2d');
          (canvas as HTMLCanvasElement).width = image.width;
          (canvas as HTMLCanvasElement).height = image.height;
          context!.drawImage(image, 0, 0, image.width, image.height);
          canvas.toBlob(async (y) => {
            this.savedFile = y!;
            resolve(null);
          });
        };
      } else {
        const imageCanvas = this.imageCanvas.nativeElement as HTMLCanvasElement;
        const ctx = imageCanvas.getContext('2d');
        const frameCanvas = this.frameCanvas.nativeElement as HTMLCanvasElement;
        const drawingCanvas = this.drawingCanvas
          .nativeElement as HTMLCanvasElement;
        ctx!.drawImage(
          frameCanvas!,
          0,
          0,
          imageCanvas.width,
          imageCanvas.height
        );
        ctx!.drawImage(
          drawingCanvas,
          0,
          0,
          imageCanvas.width,
          imageCanvas.height
        );
        this.savedImage = imageCanvas.toDataURL('image/jpeg');
        imageCanvas.toBlob((y) => {
          this.savedFile = y!;
          resolve(null);
        });
      }
    });
  }

  submit() {
    // await this.setSavedImage();
    this.dialog.close(this.croppedBlob);
  }
}
