import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppSetings, AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { EquipmentTag } from 'src/app/entities/equipmentTag';
import { EventCategory } from 'src/app/entities/eventCategory';
import { EventConfiguration } from 'src/app/entities/eventConfiguration';
import { EventSource } from '../../entities/eventSource';
import { PlantMetric } from 'src/app/entities/PlantMetric';
import { EventConfigurationCollectionMetrics } from 'src/app/entities/EventConfigurationCollectionMetrics';

@Injectable({
  providedIn: 'root'
})
export class EventConfigurationDetailService {

  insightsUrl: string;
  ip21Url: string;

  constructor(private appSettingsService: AppSettingsService, private httpClient: HttpClient) {
    let appSettings: AppSetings = this.appSettingsService.readSettings();
    this.insightsUrl = appSettings.insightsApiUrl;
    this.ip21Url = appSettings.ip21Url;
  }

  getEventConfiguration(id: number): Observable<EventConfiguration> {
    return this.httpClient.get<EventConfiguration>(`${this.insightsUrl}api/eventconfiguration/getbyid/${id}`)
      .pipe(catchError(this.handleError));
  }

  getAllEquipmentTag(): Observable<EquipmentTag[]> {
    return this.httpClient.get<EquipmentTag[]>(`${this.insightsUrl}api/equipmenttag`)
      .pipe(catchError(this.handleError));
  }

  getAllEventCategory(): Observable<EventCategory[]> {
    return this.httpClient.get<EventCategory[]>(`${this.insightsUrl}api/eventcategory/getalleventcategories`)
      .pipe(catchError(this.handleError));
  }

  getAllEventSource(): Observable<EventSource[]> {
    return this.httpClient.get<EventSource[]>(`${this.insightsUrl}api/eventsource`)
      .pipe(catchError(this.handleError));
  }

  getPlantMetricDetails(plantId: number): Observable<PlantMetric[]> {
    return this.httpClient.get<PlantMetric[]>(`${this.insightsUrl}api/metric/getplantrealtimemetricbyplantid/${plantId}`)
      .pipe(catchError(this.handleError));
  }

  getAssignedMetrics(eventConfigurationId: number): Observable<PlantMetric[]> {
    return this.httpClient.get<PlantMetric[]>(`${this.insightsUrl}api/metric/getassignedmetrics/${eventConfigurationId}`)
      .pipe(catchError(this.handleError));
  }

  insertEventConfiguration(eventConfiguration: EventConfiguration): Observable<EventConfiguration> {
    return this.httpClient.post<EventConfiguration>(`${this.insightsUrl}api/eventconfiguration/insert`, eventConfiguration)
      .pipe(catchError(this.handleError));
  }

  updateEventConfiguration(eventConfiguration: EventConfiguration) {
    return this.httpClient.post(`${this.insightsUrl}api/eventconfiguration/update`, eventConfiguration)
      .pipe(catchError(this.handleError));
  }

  inserteventconfigurationcollectionmetrics(eventConfigurationCollectionMetrics: EventConfigurationCollectionMetrics) {
    return this.httpClient.post(`${this.insightsUrl}api/eventconfigurationcollectionmetrics/insert`, eventConfigurationCollectionMetrics)
      .pipe(catchError(this.handleError));
  }

  deletealleventconfigurationcollectionmetricsbyeventconfigurationid(eventConfigurationId: number) {
    return this.httpClient.delete(`${this.insightsUrl}api/eventconfigurationcollectionmetrics/deletbyeventconfigurationid/${eventConfigurationId}`)
      .pipe(catchError(this.handleError));
  }

  getIp21Tags(plantId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.ip21Url}api/ip21/GetPlantTagsByPlantId/${plantId}`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  getTabs(): any[] {
    return [{ "Id": 1, "Name": "Start" }, { "Id": 2, "Name": "End" }, { "Id": 3, "Name": "Data Collection" }];
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
