import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSetings, AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngestionPlantMetricReportService {

  insightsUrl: string;

  constructor(private appSettingsService: AppSettingsService, private httpClient: HttpClient) {
    let appSettings: AppSetings = this.appSettingsService.readSettings();
    this.insightsUrl = appSettings.insightsApiUrl;
  }

  getReportData(): Observable<any> {
    return this.httpClient.get<any>(`${this.insightsUrl}api/ingestionplantmetric/GetReportData`)
      .pipe(catchError(this.handleError));
  }

  getTabs(): any[] {
    return [{ "Id": 1, "Name": "Active but not processing" }, { "Id": 2, "Name": "In-Active" }];
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
