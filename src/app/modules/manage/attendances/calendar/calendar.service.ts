import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { BASE_URL } from 'app/app.config';
import { AppService } from 'app/app.service';

@Injectable()
export class CalendarService implements Resolve<any>
{
    events: any;
    onEventsUpdated: Subject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _appService: AppService
    ) {
        // Set the defaults
        this.onEventsUpdated = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        console.log(route, state);
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getEvents(route.params.id)
            ]).then(
                ([events]: [any]) => {
                    console.log({ events });
                    resolve(events);
                },
                reject
            );
        });
    }

    /**
     * Get events
     *
     * @returns {Promise<any>}
     */
    getEvents(id?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let url = BASE_URL + 'employee/attendance';
            url += '?page=1&limit=1000';
            url += '&business=' + this._appService.user.business._id;
            url += '&sort_order=desc';
            if (id) {
                url += '&employee=' + id;
            }
            this._httpClient.get(url)
                .subscribe((response: any) => {
                    console.log({ calender: response });
                    this.events = response.docs;
                    this.onEventsUpdated.next(this.events);
                    resolve(this.events);
                }, reject);
        });
    }

    /**
     * Update events
     *
     * @param events
     * @returns {Promise<any>}
     */
    updateEvents(events): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/calendar/events', {
                id: 'events',
                data: [...events]
            })
                .subscribe((response: any) => {
                    this.getEvents();
                }, reject);
        });
    }

}
