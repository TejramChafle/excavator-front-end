import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, retry, delay } from 'rxjs/operators';

import { AppService } from '../../app.service';
import { BASE_URL } from '../../app.config';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    constructor(
        private _http: HttpClient,
        private _appService: AppService
        ) { }

    login(credential): Observable<any> {
        return this._http.post(BASE_URL + 'auth/login', credential, httpOptions).pipe(
            // delay(3000),
            // retry(3),
            map((response) => {
                return response;
            }),
            catchError(error => {
                this._appService.handleError(error);
                return throwError(error);
            })
        );
    }
}
