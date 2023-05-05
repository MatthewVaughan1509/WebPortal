import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from './toast.service';
import { ToastNotification, ToastType } from './toast.model.ts';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  isToastVisible: boolean = false;
  toastMessage: string;
  toastType: string;
  toastDisplayTime : number = 5000;
  toastWidth: string = "700px";
  toastPosition: string = "top";

  whatAmI: string = ToastType.Info;

  constructor(private _toastService: ToastService) { }

  private subscription: Subscription;
  toastNotification: ToastNotification;

  ngOnInit(): void {
    this.subscription = this._toastService.getObservable().subscribe((tn: ToastNotification) => {
      this.whatAmI = tn.toastType;
      this.toastMessage = tn.toastMessage;
      this.isToastVisible = true;
    }
    );
  }
}
