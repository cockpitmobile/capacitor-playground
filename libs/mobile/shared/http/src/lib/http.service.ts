import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENVIRONMENT, Environment } from '@cockpit/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    @Inject(ENVIRONMENT) private readonly _environment: Environment,
    private readonly _http: HttpClient
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
}
