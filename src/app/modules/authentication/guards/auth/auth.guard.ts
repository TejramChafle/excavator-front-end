import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    constructor(private _router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (route.url[0].path === 'auth' && route.url[1].path !== 'lock') {
            if (auth && auth.token) {
                // Redirect to the root page
                this._router.navigate(['/']);
            } else {
                return true;
            }
        }
        if (auth && auth.token) {
            return true;
        }
        // Redirect to the login page
        this._router.navigate(['auth/login']);
        return false;
    }
}
