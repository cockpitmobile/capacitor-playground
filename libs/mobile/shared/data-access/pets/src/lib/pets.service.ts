import { inject, Injectable, signal } from '@angular/core';
import { HttpService } from '@cockpit/mobile/http';
import { AppStorageService } from '@cockpit/mobile/storage';
import { map, Observable, switchMap, tap } from 'rxjs';
import { Pet, PetActivity, PetOwner } from '@cockpit/mobile/data-models';
import { StorageKey } from '@cockpit/mobile/constants';
import { setupPet, sortPets } from '@cockpit/mobile-util-pets';

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  private readonly _http = inject(HttpService);
  private readonly _storage = inject(AppStorageService);

  public readonly pets = signal<Pet[]>([]);

  // Pet API Calls
  createPet(pet: Pet): Observable<{ pet: Pet }> {
    return this._http.post('/pets', { ...pet });
  }

  // TODO: The return is { pet: Pet } but the method signature is Observable<Pet>
  updatePet(petId: string, pet: Pet): Observable<Pet> {
    return this._http.put<Pet>(`/pets/${petId}`, { ...pet });
  }

  uploadPetPhoto(petId: string, petPhoto: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', petPhoto);

    return this._http.post(`/pets/${petId}/upload`, formData);
  }

  deletePetPhoto(petId: string): Observable<any> {
    return this._http.delete(`/pets/${petId}/photo`);
  }

  searchForPet(petCode: string): Observable<{ pets: Array<Pet> }> {
    return this._http.get(`/pets?pet_code=${petCode}`);
  }

  // Pet Owner API Calls
  getPetsForOwner(userId: string): Observable<Pet[]> {
    return this._storage.getData<Pet[]>(StorageKey.USER_PETS).pipe(
      tap((pets) => {
        if (pets) {
          this.setPets(pets);
        }
      }),
      switchMap(() =>
        this._http.get<{ pets: Pet[] }>(`/users/${userId}/pets`).pipe(
          map((response) => response.pets),
          tap((pets) => {
            this.setPets(pets);
            this._storage.setData(StorageKey.USER_PETS, pets);
          })
        )
      )
    );
  }

  private setPets(pets: Pet[]) {
    this.pets.set(sortPets(pets));
    this.pets.update((pets) =>
      pets.map((pet) => ({
        ...setupPet(pet),
      }))
    );
  }

  createPetOwner(petOwner: PetOwner): Observable<{ petOwner: PetOwner }> {
    return this._http.post('/petowners', { ...petOwner });
  }

  deletePetOwner(
    petId: string,
    userId: string
  ): Observable<{ petOwner: PetOwner }> {
    return this._http.delete(`/petowners/${petId}/${userId}`);
  }

  // Pet Activities API Calls
  createPetActivities(
    petActivities: any
  ): Observable<{ pet_activities: Array<PetActivity> }> {
    return this._http.post('/petactivities', petActivities);
  }

  deletePetActivity(petId: string, eventResultId: string): Observable<any> {
    return this._http.delete(`/petactivities/${petId}/${eventResultId}`);
  }
}
