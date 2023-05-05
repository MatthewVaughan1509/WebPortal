import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadPanelService } from './load-panel.service';

@Component({
  selector: 'app-load-panel',
  templateUrl: './load-panel.component.html',
  styleUrls: ['./load-panel.component.scss']
})
export class LoadPanelComponent implements OnInit {

  isLoadPanelVisible: boolean = false;

  constructor(private _loadPanelService: LoadPanelService) { }

  private subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this._loadPanelService.getObservable().subscribe(s => {
      this.isLoadPanelVisible = s;
    }
    );
  }
}
