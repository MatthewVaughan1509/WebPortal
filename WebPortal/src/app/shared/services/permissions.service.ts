import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppSettingsService } from './app-settings.service';

@Injectable()
export class PermissionsService {
    appId: number = 26;
    plantDataCoreUrl = '';
    permissions: any[] = [];

    constructor(private http: HttpClient, private appSettingsService: AppSettingsService) {
        let appSettings = this.appSettingsService.readSettings();
        this.plantDataCoreUrl = appSettings.plantDataCoreUrl;
    }

    getPermissionForPage(routeUrl: string): Observable<any> {
        return this.http.get(`${this.plantDataCoreUrl}api/Account/GetPermissionForPage/${this.appId}/${routeUrl}`, { withCredentials: true })
            .pipe(catchError(this.handleError));
    }

    getPermissionForPageByPlant(plantId: number, routeUrl: string): Observable<any> {
        return this.http.get(`${this.plantDataCoreUrl}api/Account/GetPermissionForPageByPlant/${this.appId}/${plantId}/${routeUrl}`, { withCredentials: true })
        .pipe(catchError(this.handleError));

    }

    getPermissionForActionsByRoute(routeUrl: string): any {
        return this.permissions.find(x => x.RouteUrl == routeUrl);
    }

    private handleError(err: any) {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
            //Client Side Error
            errorMessage = `Error : ${err.error.message}`;
        } else {
            //Server Side Error
            errorMessage = `Message : ${err.message}\nException : ${err.error.ExceptionMessage}`;
        }
        console.log(errorMessage);
        //this is to display error/api exception message to the user
        return throwError(errorMessage);
    }
}