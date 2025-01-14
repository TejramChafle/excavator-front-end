import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root'
})

export class AppCache {
    
    customers: Array<any>;
    contacts: Array<any>;
    services: Array<any>;
    vehicles: Array<any>;
    fuelPumps: Array<any>;
    employees: Array<any>;

    constructor(private _dataService: DataService) {
    }

    async getCustomers() {
        const customers = JSON.parse(localStorage.getItem('customers'));
        if (customers) {
            this.customers = customers;
        } else {
            await this._dataService.records('customer', {}).subscribe((response) => {
                // console.log({ customers: response });
                this.customers = response.docs;
                localStorage.setItem('customers', JSON.stringify(this.customers));
            });
        }
        return this.customers;
    }

    getSupervisor() {
        const contacts = JSON.parse(localStorage.getItem('contacts'));
        if (contacts) {
            this.contacts = contacts;
        } else {
            this._dataService.records('contact', { contactType: 'Customer' }).subscribe((response) => {
                // console.log({ contacts: response });
                this.contacts = response.docs;
                localStorage.setItem('contacts', JSON.stringify(this.contacts));
            });
        }
        return this.contacts;
    }

    getServices() {
        const services = JSON.parse(localStorage.getItem('services'));
        if (services) {
            this.services = services;
        } else {
            this._dataService.records('service', { contactType: 'Customer' }).subscribe((response) => {
                // console.log({ services: response });
                this.services = response.docs;
                localStorage.setItem('services', JSON.stringify(this.services));
            });
        }
        return this.services;
    }

    getVehicles() {
        const vehicles = JSON.parse(localStorage.getItem('vehicles'));
        if (vehicles) {
            this.vehicles = vehicles;
        } else {

            this._dataService.records('vehicle', {}).subscribe((response) => {
                // console.log({ vehicles: response });
                this.vehicles = response.docs;
                localStorage.setItem('vehicles', JSON.stringify(this.vehicles));
            });
        }
        return this.vehicles;
    }

    getFuelPumps() {
        const fuelPumps = JSON.parse(localStorage.getItem('fuelPumps'));
        if (fuelPumps) {
            this.fuelPumps = fuelPumps;
        } else {

            this._dataService.records('petrol-pump', {}).subscribe((response) => {
                // console.log({ fuelPumps: response });
                this.fuelPumps = response.docs;
                localStorage.setItem('fuelPumps', JSON.stringify(this.fuelPumps));
            });
        }
        return this.fuelPumps;
    }

    getEmployees() {
        const employees = JSON.parse(localStorage.getItem('employees'));
        if (employees) {
            this.employees = employees;
        } else {

            this._dataService.records('employee', {}).subscribe((response) => {
                console.log({ employees: response });
                this.employees = response.docs;
                localStorage.setItem('employees', JSON.stringify(this.employees));
            });
        }
        return this.employees;
    }
}
