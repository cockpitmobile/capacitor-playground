import { Injectable } from '@angular/core';

import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection, CapacitorSQLitePlugin } from '@capacitor-community/sqlite';

const DB_NAME = 'testdb';

@Injectable({
  providedIn: 'root'
})
export class SQLiteService {
  sqliteConnection!: SQLiteConnection;
  platform!: string;
  sqlitePlugin!: CapacitorSQLitePlugin;
  native = false;

  database!: SQLiteDBConnection;

  /**
   * Plugin Initialization
   */
   initializePlugin(): boolean {
    this.sqlitePlugin = CapacitorSQLite;
    this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
    return true;
  }

  async createKeyValueTable(): Promise<void> {
    await this.database.execute(`CREATE TABLE IF NOT EXISTS key_value (key TEXT PRIMARY KEY NOT NULL, value TEXT);`);
  }

  async openDatabase(encrypted: boolean, mode: string, version: number, readonly: boolean): Promise<SQLiteDBConnection> {
    let db: SQLiteDBConnection;
    const retCC = (await this.sqliteConnection.checkConnectionsConsistency()).result;
    const isConn = (await this.sqliteConnection.isConnection(DB_NAME, readonly)).result;
    if(retCC && isConn) {
      db = await this.sqliteConnection.retrieveConnection(DB_NAME, readonly);
    } else {
      db = await this.sqliteConnection
        .createConnection(DB_NAME, encrypted, mode, version, readonly);
    }
    await db.open();
    this.database = db;

    return db;
  }

  async initializeDatabase(): Promise<void> {
    await this.createKeyValueTable();
  }

  async getData<T>(key: string): Promise<T | undefined> {
    const ret = await this.database.query(`SELECT value FROM key_value WHERE key = '${key}';`);
    if (ret.values && ret.values.length > 0) {
      return JSON.parse(ret.values[0].value);
    }
    return undefined;
  }

  async storeData(key: string, value: any): Promise<void> {
    await this.database.execute(`INSERT OR REPLACE INTO key_value (key, value) VALUES ('${key}', '${JSON.stringify(value)}');`);
  }
}
