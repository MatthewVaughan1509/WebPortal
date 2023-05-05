import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ToastNotification, ToastType } from './toast.model.ts';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private _subject = new Subject<ToastNotification>();

  constructor() { }

  getObservable(): Observable<ToastNotification> {
    return this._subject.asObservable();
  }

  custom(toastMessage: string) : void {
    this._subject.next(new ToastNotification(ToastType.Custom, toastMessage));
  }

  error(toastMessage: string) : void {
    this._subject.next(new ToastNotification(ToastType.Error, toastMessage));
  }

  info(toastMessage: string) : void {
    this._subject.next(new ToastNotification(ToastType.Info, toastMessage));
  }

  success(toastMessage: string) : void {
    this._subject.next(new ToastNotification(ToastType.Success, toastMessage));
  }

  warning(toastMessage: string) : void {
    this._subject.next(new ToastNotification(ToastType.Warning, toastMessage));
  }
}
