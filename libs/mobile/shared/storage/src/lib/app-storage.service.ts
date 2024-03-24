import { Injectable } from '@angular/core';
import { SQLiteService } from '@cockpit/sqlite';
import { StorageKey } from './constants/storage-key.enum';
import { Capacitor } from '@capacitor/core';

// import {
//   createRxDatabase,
//   addRxPlugin,
//   RxDatabase,
//   RxCollection,
//   RxJsonSchema,
//   RxDocument,
// } from 'rxdb';
// import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
// import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
// import { TestActivityCollection, testActivitySchema } from '@cockpit/data-models';


// let database: MyDatabase;

// async function _createDb(): Promise<MyDatabase> {
//   addRxPlugin(RxDBDevModePlugin);
//
//   const db: MyDatabase = await createRxDatabase({
//     name: 'testdb',                   // <- name
//     storage: getRxStorageDexie(),       // <- RxStorage
//
//     eventReduce: true,                 // <- eventReduce (performance optimizations)
//   });
//
//   await db.addCollections({
//     test_activities: {
//       schema: testActivitySchema
//     }
//   });
//
//   return db;
// }

@Injectable({
  providedIn: 'root'
})
export class AppStorageService {
  constructor(
    private readonly sqlite: SQLiteService
  ) {}

  async getData<T>(key: StorageKey): Promise<T | undefined> {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      return Promise.resolve(this._getDataLocalStorage<T>(key));
    }
    return await this.sqlite.getData<T>(key);
  }

  async setData<T>(key: StorageKey, value: T): Promise<void> {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      this._setDataLocalStorage<T>(key, value);
      return Promise.resolve();
    }
    return await this.sqlite.storeData(key, value);
  }

  private _getDataLocalStorage<T>(key: StorageKey): T | undefined {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return undefined;
  }

  private _setDataLocalStorage<T>(key: StorageKey, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

// export type MyDatabaseCollections = {
//   test_activities: TestActivityCollection
// }
//
// export type MyDatabase = RxDatabase<MyDatabaseCollections>;
