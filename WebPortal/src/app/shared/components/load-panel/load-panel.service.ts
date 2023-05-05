import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadPanelService {

  private _subject = new Subject<boolean>();

  getObservable(): Observable<boolean> {
    return this._subject.asObservable();
  }

  show() {
    this._subject.next(true);
  }

  hide() {
    this._subject.next(false);
  }

  constructor() { }
}
