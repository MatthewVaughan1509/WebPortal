import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PageDetails } from 'src/app/entities/page-details';
import { AppSetings, AppSettingsService } from 'src/app/shared/services/app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class PageDetailsService {

  baseUrl: string;

  constructor(private http: HttpClient, private appSettingsService: AppSettingsService) { 
    let appSettings: AppSetings = this.appSettingsService.readSettings();
    this.baseUrl = appSettings.baseUrl;
  }

  getPageById(id: string): Observable<PageDetails> {
    return this.http.get<PageDetails>(`${this.baseUrl}Page/GetPageById/${id}`)
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
