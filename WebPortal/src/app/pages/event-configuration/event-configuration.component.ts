import { Component, OnInit } from '@angular/core';
import { EventConfigurationService } from './event-configuration.service';
import { ErrorNotificationService } from 'src/app/shared/components/error-notification/error-notification.service';
import { LocalStorage } from '../../common/util/local-storage';
import { WindowService } from '../../shared/services/window.service';
import { EventConfiguration } from 'src/app/entities/eventConfiguration';
import { LoadPanelService } from 'src/app/shared/components/load-panel/load-panel.service';
import { Actions } from '../../entities/actions';
import { RouteUrl } from '../../entities/routeUrl';
import { PermissionsService } from 'src/app/shared/services/permissions.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-configuration',
  templateUrl: './event-configuration.component.html',
  styleUrls: ['./event-configuration.component.scss']
})
export class EventConfigurationComponent implements OnInit {

  constructor(private _eventConfigurationService: EventConfigurationService, private _errorNotificationService: ErrorNotificationService, private _windowService: WindowService, private _loadPanelServive: LoadPanelService, private _permissionsService: PermissionsService, private route: ActivatedRoute) {
    this.editIconClick = this.editIconClick.bind(this);
  }

  isGridVisible: boolean;
  dataSource: EventConfiguration[] = [];
  plantId: number;
  name: string = "PPM Insights > Event Configuration";

  hasAddPermission: boolean = false;
  hasEditPermission: boolean = false;

  get routeUrl(): string {
    return this.route.snapshot?.data?.['url'] || RouteUrl.EventConfiguration;
  }

  ngOnInit(): void {
    this.plantId = LocalStorage.getPlantId();
    this.checkHasPermission();
    if (this.plantId) {
      this.getData();
    }
  }

  checkHasPermission() {
    let permission: any = this._permissionsService.getPermissionForActionsByRoute(this.routeUrl);
    if (permission) {
      this.hasAddPermission = permission.PageActions.some(x => x.Name == Actions.Add && x.HasAccess);
      this.hasEditPermission = permission.PageActions.some(x => x.Name == Actions.Edit && x.HasAccess);
    }
  }

  getData() {
    this._loadPanelServive.show();
    this.isGridVisible = false;
    if (this.plantId) {
      this._eventConfigurationService.getAllEventConfigurationByPlantId(this.plantId).subscribe((response: EventConfiguration[]) => {
        this._loadPanelServive.hide();
        this.isGridVisible = true;
        this.dataSource = response;
      }, error => {
        this._loadPanelServive.hide();
        this._errorNotificationService.error("Failed", this.name, error);
      });
    }
  }

  changePlant(plantId: number) {
    this.plantId = plantId;
    this.getData();
  }

  addIconClick() {
    this._windowService.open(RouteUrl.EventConfigurationDetail);
  }

  editIconClick(e) {
    if (e && e.row && e.row.key) {
      this._windowService.open(`${RouteUrl.EventConfigurationDetail}?id=${e.row.key}`);
    }
  }

  onExporting(data:any){     
    data.fileName = this.name;
  }
}