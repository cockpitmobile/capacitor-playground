import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pet } from '@cockpit/mobile/data-models';
import { PetsService } from '@cockpit/mobile-data-access-pets';
import { UsersService } from '@cockpit/mobile-data-access-users';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-user-pets-page',
  imports: [CommonModule, Button],
  templateUrl: './user-pets-page.component.html',
  styleUrl: './user-pets-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPetsPageComponent implements OnInit {
  private readonly _petService = inject(PetsService);
  private readonly _userService = inject(UsersService);

  public readonly pets = this._petService.pets;
  public readonly currentUser = this._userService.currentUser;

  ngOnInit() {
    const currentUser = this.currentUser();
    if (currentUser) {
      this._petService.getPetsForOwner(currentUser.id).subscribe();
    }

    // TODO: move out of here
    localStorage.setItem('show-pets-notification', 'false');
  }

  createPet() {
    // TODO:
    // const createPetDialog = await this.dialog.open(CreatePetDialogComponent, {
    //   data: {},
    //   disableClose: true,
    //   minWidth: this.mainUtil.isMobile ? '98%' : '30rem',
    //   maxWidth: this.mainUtil.isMobile ? '98%' : '40rem',
    //   panelClass: this.mainUtil.isIOS
    //     ? 'myapp-no-padding-dialog-ios'
    //     : 'myapp-no-padding-dialog',
    //   autoFocus: false,
    // });
    //
    // createPetDialog.afterClosed().subscribe((result) => {
    //   if (result) {
    //     setupPet(result);
    //     this.petService.pets.push(result);
    //     this.petService.pets = sortPets(this.petService.pets);
    //   }
    // });
  }

  editPet(pet: Pet) {
    // TODO:
    // const editPetDialog = await this.dialog.open(CreatePetDialogComponent, {
    //   data: { pet },
    //   disableClose: true,
    //   minWidth: this.mainUtil.isMobile ? '98%' : '30rem',
    //   maxWidth: this.mainUtil.isMobile ? '98%' : '40rem',
    //   panelClass: this.mainUtil.isIOS
    //     ? 'myapp-no-padding-dialog-ios'
    //     : 'myapp-no-padding-dialog',
    //   autoFocus: false,
    // });
    //
    // editPetDialog.afterClosed().subscribe((result) => {
    //   if (result) {
    //     const index = this.petService.pets.findIndex((x) => x.id === result.id);
    //     if (index !== -1) {
    //       setupPet(result);
    //       this.petService.pets[index] = result;
    //       if (this.petService.pets[index].pet_photo_link) {
    //         this.petService.pets[index].pet_photo_link =
    //           this.petService.pets[index].pet_photo_link +
    //           '?' +
    //           new Date().getTime();
    //       }
    //       this.petService.pets = sortPets(this.petService.pets);
    //     }
    //   }
    // });
  }

  removeOwnership(pet: Pet) {
    // TODO:
    // const response = await this.dialogsUtil.showDeleteDialog(
    //   'Are you sure you want to remove your ownership of this pet?',
    //   'Remove Ownership'
    // );
    // if (!response) {
    //   return;
    // }
    // this.mainUtil.isLoading = { message: 'Removing ownership' };
    // try {
    //   await this.petService
    //     .deletePetOwner(pet.id, this.userService.currentUser.id)
    //     .pipe(timeout(this.mainUtil.timeoutLimit))
    //     .toPromise();
    //   const index = this.petService.pets.findIndex((x) => x.id === pet.id);
    //   if (index !== -1) {
    //     this.petService.pets.splice(index, 1);
    //   }
    //   this.mainUtil.showSnackbar(
    //     'You have been successfully removed as an owner of this pet.',
    //     3000
    //   );
    // } catch (error) {
    //   this.mainUtil.handleError(error);
    //   this.mainUtil.showSnackbar(
    //     'Something went wrong removing ownership of this pet. Please try again.',
    //     3000
    //   );
    // }
    // this.mainUtil.isLoading = false;
  }

  onKeyDown(event: any) {
    if (event.key === 'Enter') {
      this.searchPets();
    }
  }

  searchPets() {
    // Grab the pet code from the input
    // TODO:
    // const petCode = (
    //   document.getElementById('petSearch') as HTMLInputElement
    // ).value.toUpperCase();
    //
    // // Check if the petCode entered is one of the current user's pet's code, if not search by petCode
    // const index = this.petService.pets.findIndex((x) => x.pet_code === petCode);
    // if (index !== -1) {
    //   this.petSearchResult = null;
    //   this.mainUtil.showSnackbar(
    //     'The pet code entered already belongs to one of your pets. Try again.'
    //   );
    // } else {
    //   this.mainUtil.isLoading = { message: 'Searching for pet' };
    //   try {
    //     const response = await this.petService
    //       .searchForPet(petCode)
    //       .pipe(timeout(this.mainUtil.timeoutLimit))
    //       .toPromise();
    //     if (response?.pets?.length) {
    //       setupPet(response.pets[0]);
    //       this.petSearchResult = response.pets[0];
    //     } else {
    //       this.petSearchResult = null;
    //       this.mainUtil.showSnackbar(
    //         `Pet with pet code ${petCode} not found. Try again.`
    //       );
    //     }
    //   } catch (err) {
    //     this.petSearchResult = null;
    //     this.mainUtil.showSnackbar('Error searching for pet. Try again.');
    //   }
    //   this.mainUtil.isLoading = false;
    // }
  }

  addUserAsOwner() {
    // TODO:
    // try {
    //   await this.petService
    //     .createPetOwner({
    //       pet_id: this.petSearchResult.id,
    //       user_id: this.userService.currentUser.id,
    //     })
    //     .pipe(timeout(this.mainUtil.timeoutLimit))
    //     .toPromise();
    //   this.petService.pets.push(this.petSearchResult);
    //   this.petService.pets = sortPets(this.petService.pets);
    //   this.petSearchResult = null;
    // } catch (error) {
    //   // If there is an error within the try
    //   this.mainUtil.handleError(error);
    //   this.mainUtil.isLoading = false;
    //   this.mainUtil.showSnackbar(
    //     'There was an error adding this pet. Please try again.'
    //   );
    // }
  }
}
