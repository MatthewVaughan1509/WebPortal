import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IngestionFrequency } from 'src/app/entities/ingestionFrequency';
import { IngestionInterval } from 'src/app/entities/ingestionInterval';
import { IngestionPlantMetric } from 'src/app/entities/ingestionPlantMetric';
import { IngestionMovingAverage } from 'src/app/entities/ingestionMovingAverage';
import { PlantMetric } from 'src/app/entities/PlantMetric';
import { AppSetings, AppSettingsService } from 'src/app/shared/services/app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class IngestionPlantMetricService {

  insightsUrl: string;

  constructor(private appSettingsService: AppSettingsService, private httpClient: HttpClient) {
    let appSettings: AppSetings = this.appSettingsService.readSettings();
    this.insightsUrl = appSettings.insightsApiUrl;
  }

  getPlantMetricDetails(plantId: number): Observable<PlantMetric[]> {
    return this.httpClient.get<PlantMetric[]>(`${this.insightsUrl}api/metric/getPlantRealtimeMetricByPlantId/${plantId}`)
      .pipe(catchError(this.handleError));
  }

  getIngestionPlantMetricbyPlant(plantId: number): Observable<IngestionPlantMetric[]> {
    return this.httpClient.get<IngestionPlantMetric[]>(`${this.insightsUrl}api/ingestionPlantMetric/getByPlantId/${plantId}`)
      .pipe(catchError(this.handleError));
  }

  getAllIngestionFrequency(): Observable<IngestionFrequency[]> {
    return this.httpClient.get<IngestionFrequency[]>(`${this.insightsUrl}api/IngestionFrequency/getAll`)
      .pipe(catchError(this.handleError));
  }

  getAllIngestionMovingAverages(): Observable<IngestionMovingAverage[]> {
    return this.httpClient.get<IngestionMovingAverage[]>(`${this.insightsUrl}api/IngestionMovingAverage/getAll`)
      .pipe(catchError(this.handleError));
  }

  getAllIngestionInterval(): Observable<IngestionInterval[]> {
    return this.httpClient.get<IngestionInterval[]>(`${this.insightsUrl}api/IngestionInterval/getAll`)
      .pipe(catchError(this.handleError));
  }

  insertIngestionPlantMetric(ingestionPlantMetric: IngestionPlantMetric[]): Observable<IngestionPlantMetric[]> {
    return this.httpClient.post<IngestionPlantMetric[]>(`${this.insightsUrl}api/ingestionPlantMetric/InsertMultiple`, ingestionPlantMetric)
      .pipe(catchError(this.handleError));
  }

  deleteIngestionPlantMetric(ingestionPlantMetric: IngestionPlantMetric[]): Observable<IngestionPlantMetric[]> {
    return this.httpClient.post<IngestionPlantMetric[]>(`${this.insightsUrl}api/ingestionPlantMetric/DeleteMultiple`, ingestionPlantMetric)
      .pipe(catchError(this.handleError));
  }

  updateIngestionPlantMetric(ingestionPlantMetric: IngestionPlantMetric) {
    return this.httpClient.post(`${this.insightsUrl}api/ingestionPlantMetric/update`, ingestionPlantMetric)
      .pipe(catchError(this.handleError));
  }

  getTabs(): any[] {
    return [{ "Id": 1, "Name": "Realtime PPM Metric" }];
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
