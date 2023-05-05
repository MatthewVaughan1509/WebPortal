import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorNotification } from '../../models/error-notification';
import { ErrorNotificationService } from './error-notification.service';

@Component({
  selector: 'app-error-notification',
  templateUrl: './error-notification.component.html',
  styleUrls: ['./error-notification.component.scss']
})

export class ErrorNotificationComponent implements OnInit {

  errorNotification: ErrorNotification;
  private subscription: Subscription;
  errorDataSource: any = [];

  get showError(): boolean {
    return this.errorNotification != null && this.errorNotification != undefined;
  }

  constructor(private service: ErrorNotificationService) { }

  ngOnInit(): void {
    this.subscription = this.service.getObservable().subscribe(notification => {
      this._addNotification(notification)
    }
    );
  }

  onPopupShowing(e: any) {
    if (e.component && e.component.topToolbar() && !e.component.topToolbar().hasClass('error-title')) {
      e.component.topToolbar().addClass('error-title');
    }
  }

  private _addNotification(notification: ErrorNotification) {
    this.errorNotification = notification;
    if (this.errorNotification && this.errorNotification.technicalDetails) {
      this.errorDataSource = [{
        "Id": 1,
        "TechnicalDetails": this.errorNotification.technicalDetails
      }];
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onPopUpClosing(e: any) {
    this.errorNotification = null;
    this.errorDataSource = [];
  }

}
