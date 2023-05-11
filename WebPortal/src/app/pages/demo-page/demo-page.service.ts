import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AppSetings, AppSettingsService } from 'src/app/shared/services/app-settings.service'; 
import { GridItem } from 'src/app/entities/GridItem';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DemoPageService {

  baseUrl: string;

  constructor(private http: HttpClient, private appSettingsService: AppSettingsService) { 
    let appSettings: AppSetings = this.appSettingsService.readSettings();
    this.baseUrl = appSettings.baseUrl;
  }

  getAllData(): Observable<GridItem[]> {
    return this.http.get<GridItem[]>(`${this.baseUrl}Page/GetAllPages`)
    .pipe(catchError(this.handleError));
  }

  private handleError(err: any) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      //Client Side Error
      errorMessage = `Error : ${err.error.message}`;
    } else {
      //Server Side Error
      errorMessage = `Message : ${err.message}\nError : ${err.error}`;
    }
    console.log(errorMessage);
    //this is to display error/api exception message to the user
    return throwError(errorMessage);
  }
}
