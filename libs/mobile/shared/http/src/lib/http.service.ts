import { DestroyRef, Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, concat, EMPTY, map, Observable, retry, share, switchMap, throwError, timeout, TimeoutError } from 'rxjs';
import { ENVIRONMENT, Environment } from '@cockpit/environment';
import { StorageKey } from '@cockpit/constants';
import { SyncTask } from './sync-task.class';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NetworkService } from '@cockpit/network';

const HTTP_TIMEOUT_IN_MS = 5000;

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  processQueue$ = this._network.networkStatus$.pipe(
    switchMap(connected => connected ? this.sync() : EMPTY),
    takeUntilDestroyed(this._destroyRef)
  ).subscribe();

  constructor(
    @Inject(ENVIRONMENT) private readonly _environment: Environment,
    private readonly _http: HttpClient,
    private readonly _network: NetworkService,
    private readonly _destroyRef: DestroyRef
  ) { }

  get<T>(url: string): Observable<T> {
    return this._http.get<T>(`${this._environment.apiBaseUrl}${url}`);
  }

  post<T>(url: string, body: any): Observable<T> {
    return this._http.post<T>(`${this._environment.apiBaseUrl}${url}`, body);
  }

  put<T>(url: string, body: any): Observable<T> {
    return this._http.put<T>(`${this._environment.apiBaseUrl}${url}`, body);
  }

  delete<T>(url: string): Observable<T> {
    return this._http.delete<T>(`${this._environment.apiBaseUrl}${url}`);
  }

  // Syncing code below
  postWithSync<T extends { id: number; }>(url: string, payload: T, params: HttpParams): Observable<T> {
    return this._http.post<T>(`${this._environment.apiBaseUrl}${url}`, payload, { params }).pipe(
      timeout(HTTP_TIMEOUT_IN_MS),
      retry(2),
      catchError((err: HttpErrorResponse) => this.handleError(err, `${this._environment.apiBaseUrl}${url}`, payload, params)),
      share()
    );
  }

  sync(): Observable<any> {
    console.log('TASKS')
    const syncTasks = this.getExistingSyncTasks();
    const requests: Observable<any>[] = [];

    syncTasks.forEach((task: SyncTask<any>) => {
      const params = { params: new HttpParams({ fromString: task.params }) };
      const obs$ = this._http.post(task.url, task.body, params)
        .pipe(map(_ => task));

      requests.push(obs$);
    });

    const all$ = concat(...requests).pipe(share());

    all$.subscribe(task => {
      const index = syncTasks.findIndex(t => t.body.id === task.id);
      syncTasks.splice(index, 1);
      localStorage.setItem(StorageKey.SYNC_TASKS, JSON.stringify(syncTasks));
    });

    return all$;
  }

  private handleError<T extends { id: number; }>(err: HttpErrorResponse,
    url: string,
    payload: T,
    params: HttpParams): Observable<any> {
    if (this.offlineOrBadConnection(err)) {
      // A client-side or network error occurred. Handle it accordingly.
      this.addOrUpdateSyncTask<T>(url, payload, params);
      return EMPTY;
    } else {
      console.log('A backend error occurred.', err);
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      return throwError(err);
    }
  }

  private offlineOrBadConnection(err: HttpErrorResponse): boolean {
    return (
      err instanceof TimeoutError ||
      err.error instanceof ErrorEvent ||
      !this._network.isConnected
    );
  }

  private addOrUpdateSyncTask<T extends { id: number; }>(url: string, payload: T, params: HttpParams): void {
    const tasks = this.getExistingSyncTasks();

    const syncTask = new SyncTask(url, payload, params.toString());
    tasks.push(syncTask);
    localStorage.setItem(StorageKey.SYNC_TASKS, JSON.stringify(tasks));
  }

  private getExistingSyncTasks(): SyncTask<any>[] {
    const serializedTasks = localStorage.getItem(StorageKey.SYNC_TASKS);

    return (serializedTasks)
      ? JSON.parse(serializedTasks)
      : [];
  }
}
