import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EventConfiguration } from 'src/app/entities/eventConfiguration';
import { AppSetings, AppSettingsService } from 'src/app/shared/services/app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class EventConfigurationService {

  insightsUrl: string;

  constructor(private httpClient: HttpClient, private appSettingsService: AppSettingsService) {
    let appSettings: AppSetings = this.appSettingsService.readSettings();
    this.insightsUrl = appSettings.insightsApiUrl;
  }

  getAllEventConfigurationByPlantId(plantId: number): Observable<EventConfiguration[]> {
    return this.httpClient.get<EventConfiguration[]>(`${this.insightsUrl}api/eventconfiguration/getbyplantid/${plantId}`)
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
