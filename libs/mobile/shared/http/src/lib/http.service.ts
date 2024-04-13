import { DestroyRef, Inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import {
  catchError,
  concat,
  from,
  map,
  Observable,
  of,
  retry,
  share,
  switchMap,
  tap,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';
import { ENVIRONMENT, Environment } from '@cockpit/mobile/environment';
import { StorageKey } from '@cockpit/mobile/constants';
import { SyncTask } from './sync-task.class';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import {
  networkIsConnectedSelector,
  networkSyncingChanged,
} from '@cockpit/mobile/network-state';
import * as uuid from 'uuid';
import write_blob from 'capacitor-blob-writer';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { blobToFile } from '@cockpit/mobile/file-utils';
import { Capacitor } from '@capacitor/core';

const HTTP_TIMEOUT_IN_MS = 5000;

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  isConnected = false;

  isConnectedChange$ = this._store
    .select(networkIsConnectedSelector)
    .pipe(
      takeUntilDestroyed(this._destroyRef),
      tap((connected) => (this.isConnected = connected))
    )
    .subscribe();

  constructor(
    @Inject(ENVIRONMENT) private readonly _environment: Environment,
    private readonly _http: HttpClient,
    private readonly _destroyRef: DestroyRef,
    private readonly _store: Store
  ) {}

  get<T>(url: string): Observable<T> {
    return this._http.get<T>(`${this._environment.apiBaseUrl}${url}`);
  }

  post<T>(url: string, body: T): Observable<T> {
    return this._http.post<T>(`${this._environment.apiBaseUrl}${url}`, body);
  }

  put<T>(url: string, body: T): Observable<T> {
    return this._http.put<T>(`${this._environment.apiBaseUrl}${url}`, body);
  }

  delete<T>(url: string): Observable<T> {
    return this._http.delete<T>(`${this._environment.apiBaseUrl}${url}`);
  }

  postImageWithSync(url: string, image: Blob): Observable<{ link: string }> {
    const formData = new FormData();
    formData.append('file', blobToFile(image, 'file'));

    return this._http
      .post<{ link: string }>(`${this._environment.apiBaseUrl}${url}`, formData)
      .pipe(
        timeout(HTTP_TIMEOUT_IN_MS),
        retry(2),
        catchError((err: HttpErrorResponse) =>
          this.handleErrorImage(
            err,
            url,
            { id: uuid.v4(), image },
            new HttpParams()
          )
        ),
        share()
      );
  }

  // Syncing code below
  postWithSync<T extends { id: number }>(
    url: string,
    payload: T,
    params: HttpParams
  ): Observable<T> {
    return of(true).pipe(
      switchMap(() =>
        this._http
          .post<T>(`${this._environment.apiBaseUrl}${url}`, payload, { params })
          .pipe(
            timeout(HTTP_TIMEOUT_IN_MS),
            retry(2),
            catchError((err: HttpErrorResponse) =>
              this.handleError(
                err,
                `${this._environment.apiBaseUrl}${url}`,
                payload,
                params
              )
            ),
            share()
          )
      )
    );
  }

  sync(): Observable<any> {
    this._store.dispatch(networkSyncingChanged({ syncing: true }));
    console.log('TASKS');
    const syncTasks = this.getExistingSyncTasks();
    const requests: Observable<any>[] = [];

    syncTasks.forEach((task: SyncTask<any>) => {
      const params = { params: new HttpParams({ fromString: task.params }) };
      let obs$: Observable<SyncTask<any>>;
      if (task.body.sync_type === 'image') {
        obs$ =
          Capacitor.getPlatform() === 'web'
            ? from(
                Filesystem.readFile({
                  path: task.body.url,
                  directory: Directory.Data,
                })
              ).pipe(
                switchMap(({ data }) => {
                  const formData = new FormData();
                  formData.append('file', blobToFile(data as Blob, 'file'));
                  return this._http
                    .post<{
                      link: string;
                    }>(task.url, formData, params)
                    .pipe(map(() => task));
                })
              )
            : from(fetch(task.body.link)).pipe(
                switchMap((response) =>
                  from(response.blob()).pipe(
                    switchMap((blob) => {
                      const formData = new FormData();
                      formData.append('file', blobToFile(blob, 'file'));
                      return this._http
                        .post<{ link: string }>(task.url, formData, params)
                        .pipe(map((_) => task));
                    })
                  )
                )
              );
      } else {
        obs$ = this._http
          .post(task.url, task.body, params)
          .pipe(map(() => task));
      }

      requests.push(obs$);
    });

    if (requests.length) {
      const all$ = concat(...requests).pipe(share());

      all$.subscribe((task) => {
        const index = syncTasks.findIndex((t) => t.body.id === task.id);
        syncTasks.splice(index, 1);
        localStorage.setItem(StorageKey.SYNC_TASKS, JSON.stringify(syncTasks));
      });

      return all$;
    }

    return of(null);
  }

  private handleErrorImage<
    T extends {
      id: number | string;
      image: Blob;
    },
  >(
    err: HttpErrorResponse,
    url: string,
    payload: T,
    params: HttpParams
  ): Observable<{ link: string }> {
    // TODO: THIS NEEDS ERROR HANDLING!!!
    return from(
      write_blob({
        blob: payload.image,
        directory: Directory.Data,
        path: url,
        recursive: true,
        fast_mode: true,
      })
    ).pipe(
      switchMap((path) =>
        Capacitor.getPlatform() === 'web'
          ? from(
              Filesystem.readFile({
                path: url,
                directory: Directory.Data,
              })
            ).pipe(
              switchMap(({ data }) =>
                this.handleError(
                  err,
                  `${this._environment.apiBaseUrl}${url}`,
                  {
                    id: payload.id,
                    link: URL.createObjectURL(data as Blob),
                    url,
                    sync_type: 'image',
                  },
                  params
                ).pipe(
                  map(() => ({
                    link: URL.createObjectURL(data as Blob),
                  }))
                )
              )
            )
          : from(
              Filesystem.getUri({ directory: Directory.Data, path: url })
            ).pipe(
              map(({ uri }) => Capacitor.convertFileSrc(uri)),
              map((uri) => ({ link: uri })),
              switchMap(({ link }) =>
                this.handleError(
                  err,
                  `${this._environment.apiBaseUrl}${url}`,
                  {
                    id: payload.id,
                    link,
                    url,
                    sync_type: 'image',
                  },
                  params
                ).pipe(map(() => ({ link })))
              )
            )
      )
    );
  }

  private handleError<T extends { id: number | string }>(
    err: HttpErrorResponse,
    url: string,
    payload: T,
    params: HttpParams
  ): Observable<any> {
    if (this.offlineOrBadConnection(err)) {
      console.log('OFFLINE');
      // A client-side or network error occurred. Handle it accordingly.
      this.addOrUpdateSyncTask<T>(url, payload, params);
      return of(null);
    }
    console.log('A backend error occurred.', err);
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    return throwError(err);
  }

  private offlineOrBadConnection(err: HttpErrorResponse): boolean {
    return (
      err instanceof TimeoutError ||
      err.error instanceof ErrorEvent ||
      !this.isConnected
    );
  }

  private addOrUpdateSyncTask<T extends { id: number | string }>(
    url: string,
    payload: T,
    params: HttpParams
  ): void {
    const tasks = this.getExistingSyncTasks();

    const syncTask = new SyncTask(url, payload, params.toString());
    tasks.push(syncTask);
    localStorage.setItem(StorageKey.SYNC_TASKS, JSON.stringify(tasks));
  }

  private getExistingSyncTasks(): SyncTask<any>[] {
    const serializedTasks = localStorage.getItem(StorageKey.SYNC_TASKS);

    return serializedTasks ? JSON.parse(serializedTasks) : [];
  }
}
