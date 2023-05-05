import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EventReportData } from 'src/app/entities/eventReportData';
import { AppSetings, AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { EquipmentTag } from 'src/app/entities/equipmentTag';

@Injectable({
  providedIn: 'root'
})
export class PlantAndEventCategoryService {

  insightsUrl: string;

  constructor(private httpClient: HttpClient, private appSettingsService: AppSettingsService) {
    let appSettings: AppSetings = this.appSettingsService.readSettings();
    this.insightsUrl = appSettings.insightsApiUrl;
  }

  getReportByPlantAndCategory(plantId: number, eventCategoryId: number, equipmentTagId: number, startDate: string, endDate: string): Observable<EventReportData> {
    return this.httpClient.get<EventReportData>(`${this.insightsUrl}api/BatchFillReport/getByPlantAndCategory/${plantId}/${eventCategoryId}/${equipmentTagId}/${startDate}/${endDate}`)
      .pipe(catchError(this.handleError));
  }

  getAllEventCategories(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.insightsUrl}api/eventcategory/getalleventcategories`)
      .pipe(catchError(this.handleError));
  }

  getAllEquipmentTag(): Observable<EquipmentTag[]> {
    return this.httpClient.get<EquipmentTag[]>(`${this.insightsUrl}api/equipmenttag`)
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
