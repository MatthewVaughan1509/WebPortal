import { Component, OnInit } from '@angular/core';
import { DemoPageService } from './demo-page.service';
import { GridItem } from 'src/app/entities/GridItem';
import { ErrorNotificationService } from 'src/app/shared/components/error-notification/error-notification.service';
import { WindowService } from 'src/app/shared/services/window.service';
import { RouteUrl } from 'src/app/entities/routeUrl';

@Component({
  selector: 'app-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss']
})
export class DemoPageComponent implements OnInit {

  constructor(private service: DemoPageService, private notificationService: ErrorNotificationService, private windowService: WindowService) { 
    this.editIconClick = this.editIconClick.bind(this);
  }

  isLoadPanelVisible: boolean = false;
  gridItems: GridItem[];
  channel: BroadcastChannel;

  hasAddPermission: boolean;
  hasEditPermission: boolean;
  hasDeletePermission: boolean;

  ngOnInit(): void {
    this.checkHasPermission();
    this.getAllGridItems();
    this.channel = new BroadcastChannel('app-reload-pages');
    this.channel.addEventListener('message', (event) => {
      if (event.data === "reloadPages") {
        this.getAllGridItems();
      }
    });
  }

  checkHasPermission() {
    // A permissions API is called here to determine the value of the three properties below.
    // For this demonstration these are set to true.
    this.hasAddPermission = true;
    this.hasEditPermission = true;
    this.hasDeletePermission = true;
  }

  getAllGridItems() {
    this.isLoadPanelVisible = true;
    this.service.getAllData().subscribe(response => {
      this.gridItems = response;
      this.isLoadPanelVisible = false;
    }, error => {
      this.notificationService.error('error', 'Error occurred while loading pages.', error);
      this.isLoadPanelVisible = false;
    });
  }

  refreshDataGrid() {
    this.getAllGridItems();
  }

  editIconClick(e) {
    if (e && e.row && e.row.key) {
      this.windowService.open(`${RouteUrl.DemoDetails}?pageid=${e.row.key}`);
    }
  }

  addIconClick() {
    this.windowService.open(`${RouteUrl.DemoDetails}`);
  }

  onExporting(data: any) {
    data.fileName = "AllItems";
  }

}
