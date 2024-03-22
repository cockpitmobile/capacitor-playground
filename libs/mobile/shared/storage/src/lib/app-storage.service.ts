import { Injectable } from '@angular/core';
import { TestActivity } from '@cockpit/data-models';
import { BehaviorSubject } from 'rxjs';
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

let initState: null | Promise<any> = null;

/**
 * This is run via APP_INITIALIZER in app.module.ts
 * to ensure the database exists before the angular-app starts up
 */
export async function initDatabase() {
  /**
   * When server side rendering is used,
   * The database might already be there
   */
  if (!initState) {
    console.log('initDatabase()');
    initState = Promise.resolve();//_createDb().then(db => database = db);
  }
  await initState;
}

@Injectable({
  providedIn: 'root'
})
export class AppStorageService {
  // get db(): MyDatabase {
  //   return database;
  // }

  private _testActivities$$ = new BehaviorSubject<TestActivity[]>([]);
  public testActivities$ = this._testActivities$$.asObservable();

  private _testActivities: TestActivity[] = [];

  createTestActivity(activity: TestActivity): TestActivity {
    this._testActivities.push(activity);
    this._testActivities$$.next(this._testActivities);

    return activity;
  }
}

// export type MyDatabaseCollections = {
//   test_activities: TestActivityCollection
// }
//
// export type MyDatabase = RxDatabase<MyDatabaseCollections>;
