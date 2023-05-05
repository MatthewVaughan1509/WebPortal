import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppSetings, AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { Region } from 'src/app/entities/region';
import { Plant } from 'src/app/entities/plant';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  plantDataCoreUrl: string;

  constructor(private appSettingsService: AppSettingsService, private httpClient: HttpClient) { 
    let appSettings: AppSetings = this.appSettingsService.readSettings();
    this.plantDataCoreUrl = appSettings.plantDataCoreUrl;
  }

  getAllRegions() : Observable<Region[]> {
    return this.httpClient.get<any[]>(`${this.plantDataCoreUrl}api/Region/GetAllActive/`, { withCredentials: true })
    .pipe(catchError(this.handleError));
  }

  getPlantByRegionId(regionId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.plantDataCoreUrl}api/Plant/GetByRegionId/${regionId}/true`, { withCredentials: true })
        .pipe(catchError(this.handleError));
  }

  getAllPlants() : Observable<Plant[]> {
    return this.httpClient.get<Plant[]>(`${this.plantDataCoreUrl}api/Plant/GetAllActive/`, { withCredentials: true })
    .pipe(catchError(this.handleError));
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
