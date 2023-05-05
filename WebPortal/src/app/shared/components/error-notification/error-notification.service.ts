import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ErrorNotification } from '../../models/error-notification';

@Injectable({
  providedIn: 'root'
})
export class ErrorNotificationService {

  private _subject = new Subject<ErrorNotification>();

  constructor() { }

  getObservable(): Observable<ErrorNotification> {
    return this._subject.asObservable();
  }

  error(title: string, message: string, technicalDetails: string) {
    this._subject.next(new ErrorNotification(title, message, technicalDetails));
  }
  
}
