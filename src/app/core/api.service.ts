// src/app/core/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Dog } from './dog';
import { DogDetail } from './dog-detail';

@Injectable()
export class ApiService {
    private _API = `${environment.apiRoot}api`;

    constructor(
        private http: HttpClient,
        private auth: AuthService) { }

    getDogs$(): Observable<Dog[]> {
        return this.http
            .get<Dog[]>(`${this._API}/dogs`)
            .pipe(
                catchError((err, caught) => this.onError(err, caught))
            );
    }

    getDogByRank$(rank: number): Observable<DogDetail> {
        return this.http
            .get<DogDetail>(`${this._API}/dog/${rank}`, {
                headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.accessToken}`)
            })
            .pipe(
                catchError((err, caught) => this.onError(err, caught))
            );
    }

    private onError(err, caught) {
        let errorMsg = 'Error: Unable to complete request.';
        if (err instanceof HttpErrorResponse) {
            errorMsg = err.message;
            if (err.status === 401 || errorMsg.indexOf('No JWT') > -1 || errorMsg.indexOf('Unauthorized') > -1) {
                this.auth.login();
            }
        }
        return throwError(errorMsg);
    }

}
