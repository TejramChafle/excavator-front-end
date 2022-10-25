import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AppService } from './app.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AppInterceptor implements HttpInterceptor {
    constructor(
        private _appService: AppService,
        private _router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!request.url.includes('/auth') && this._appService.user) {
            request = request.clone({
                headers: request.headers.set('authorization', 'Bearer ' + this._appService.user.token)
            });
        } else {
            this._router.navigate(['/auth/login']);
        }
        console.log({request});
        return next.handle(request);
    }
}