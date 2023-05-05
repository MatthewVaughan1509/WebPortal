import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';

import { ErrorNotificationService } from 'src/app/shared/components/error-notification/error-notification.service';
import { EventConfigurationDetailService } from './event-configuration-detail.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { forkJoin } from 'rxjs';

import { EquipmentTag } from 'src/app/entities/equipmentTag';
import { EventConfiguration } from 'src/app/entities/eventConfiguration';
import { EventCategory } from 'src/app/entities/eventCategory';
import { EventSource } from 'src/app/entities/eventSource';
import { Plant } from 'src/app/entities/plant';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { PlantMetric } from 'src/app/entities/PlantMetric';
import { EventConfigurationCollectionMetrics } from 'src/app/entities/EventConfigurationCollectionMetrics';
import { LoadPanelService } from 'src/app/shared/components/load-panel/load-panel.service';
import { Actions } from '../../entities/actions';
import { RouteUrl } from '../../entities/routeUrl';
import { PermissionsService } from 'src/app/shared/services/permissions.service';
import { Ip21Tag } from 'src/app/entities/Ip21Tag';

@Component({
  selector: 'app-event-configuration-detail',
  templateUrl: './event-configuration-detail.component.html',
  styleUrls: ['./event-configuration-detail.component.scss']
})
export class EventConfigurationDetailComponent implements OnInit {

  @ViewChild('assignedGridRef', { static: false }) assignedGrid: DxDataGridComponent;
  @ViewChild('availableGridRef', { static: false }) availableGrid: DxDataGridComponent;
  @ViewChild('targetGroup', { static: false }) validationGroup: DxValidationGroupComponent;

  eventConfigurationId: number = 0;

  eventConfiguration: EventConfiguration = new EventConfiguration;

  plantId: number;
  plants: Plant[] = [];
  equipmentTags: EquipmentTag[] = [];
  eventCategories: EventCategory[] = [];
  eventSource: EventSource[] = [];
  ip21StartTags: Ip21Tag[] = [];
  ip21EndTags: Ip21Tag[] = [];

  eventCategoryDescription: string = "";
  plantName: string = "";

  tabs: any[] = [];
  activeTab: number = 3;

  assignedMetrics: PlantMetric[] = [];
  allMetrics: PlantMetric[] = [];

  gridHeight: string;
  name: string = "PPM Insights > Event Configuration";
  pageTitle: string = "";

  ipTextMap: string = "IP_TextMap";

  get routeUrl(): string {
    return this.route.snapshot?.data?.['url'] || RouteUrl.EventConfigurationDetail;
  }

  constructor(private route: ActivatedRoute, private _errorNotificationService: ErrorNotificationService, private _eventConfigurationDetailService: EventConfigurationDetailService, private _commonService: CommonService, private _loadPanelServive: LoadPanelService, private _toastService: ToastService, private _permissionsService: PermissionsService, private router: Router) {
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }

  plantReadOnly: boolean = true;
  hasAddPermission: boolean = false;
  hasEditPermission: boolean = false;
  isDisabled: boolean = true;
  focusedRowEnabled: boolean = false;
  selectionMode: string;

  ngOnInit(): void {
    this.eventConfigurationId = parseInt(this.route.snapshot.queryParamMap.get('id'));
    this.checkHasPermission();
    if (this.eventConfigurationId) {
      this.getData(this.eventConfigurationId);
    } 
    this.getFormData();
    this.tabs = this._eventConfigurationDetailService.getTabs();
    this.gridHeight = `${window.innerHeight / 2}px`;
  }

  checkHasPermission() {
    let permission: any = this._permissionsService.getPermissionForActionsByRoute(this.routeUrl);
    if (permission) {
      this.hasAddPermission = permission.PageActions.some(x => x.Name == Actions.Add && x.HasAccess);
      this.hasEditPermission = permission.PageActions.some(x => x.Name == Actions.Edit && x.HasAccess);
      if ((!this.eventConfigurationId || this.eventConfigurationId === 0) && (!this.hasAddPermission)) {
        this.router.navigate([RouteUrl.Unauthorized]);
      }
      if (this.hasAddPermission && (this.eventConfigurationId === 0 || isNaN(this.eventConfigurationId))) {
        this.isDisabled = false;
        this.plantReadOnly = false;
      } else if (this.hasEditPermission && this.eventConfigurationId > 0) {
        this.isDisabled = false;
      }
      this.focusedRowEnabled = !this.isDisabled;
      this.selectionMode = this.focusedRowEnabled ? "multiple" : "none";
    }
  }

  setPageName() {
    this.pageTitle = `PPM Insights > Event Configuration > ${this.plantName} ${(this.eventConfiguration.Name) ? `> ${this.eventConfiguration.Name}` : ""}`;
  }

  getData(id: number) {
    this._loadPanelServive.show();
    this._eventConfigurationDetailService.getEventConfiguration(id).subscribe(eventConfiguration => {
      this._loadPanelServive.hide();
      this.eventConfiguration = eventConfiguration;
      this.plantId = eventConfiguration.PlantId;
    }, error => {
      this._errorNotificationService.error("Failed", this.name, error);
    });
  }

  getFormData() {
    this._loadPanelServive.show();
    forkJoin([
      this._commonService.getAllPlants(),
      this._eventConfigurationDetailService.getAllEquipmentTag(),
      this._eventConfigurationDetailService.getAllEventCategory(),
      this._eventConfigurationDetailService.getAllEventSource()
    ]).subscribe(results => {
      this._loadPanelServive.hide();
      if (results) {
        if (results.length > 0) {
          this.plants = results[0];
          if (this.eventConfiguration && this.eventConfiguration.PlantId) {
            this.setPlantName(this.eventConfiguration.PlantId);
          }
        }
        if (results.length > 1) {
          this.equipmentTags = results[1];
        }
        if (results.length > 2) {
          this.eventCategories = results[2];
          if (this.eventConfiguration && this.eventConfiguration.EventCategoryId) {
            this.setEventCategoryDescription(this.eventConfiguration.EventCategoryId);
          }
        }
        if (results.length > 3) {
          this.eventSource = results[3];
        }
      }
    }, error => {
      this._loadPanelServive.hide();
      this._errorNotificationService.error("Failed", this.name, error);
    });
  }

  setEventCategoryDescription(id: number) {

    let descriptions: string[] = [];
    let parentId: number;
    parentId = this.eventCategories.find(f => f.Id === id)?.ParentId;
    descriptions.push(this.getEventCategoryName(id));

    while (parentId && parentId !== 0) {
      descriptions.push(this.getEventCategoryName(parentId));
      let parent = this.eventCategories.find(f => f.Id === parentId);
      parentId = parent.ParentId;
    }

    let chevron = this.eventCategoryDescription = "";
    while (descriptions.length) {
      var desc = descriptions.pop();
      this.eventCategoryDescription += `${chevron}${desc} `;
      chevron = "> ";
    }
  }

  getEventCategoryName(id: number): string {
    return this.eventCategories.find(f => f.Id === id)?.Name;
  }

  setPlantName(id: number) {
    let p = this.plants.find(f => f.Id === id);
    if (p) {
      this.plantName = p.Name;
      this.setPageName();
    }
  }

  onNameChanged(e) {
    this.setPageName();
  }

  onPlantChanged(e) {
    if (e.value) {
      this.plantId = e.value;
      this.setPlantName(e.value);
      this.getMetrics();
      this.getIp21Tags();
    }
  }

  getMetrics() {
    if (this.plantId) {
      this._loadPanelServive.show();
      this._eventConfigurationDetailService.getAssignedMetrics(this.eventConfiguration.Id).subscribe(result => {
        this._loadPanelServive.hide();
        this.assignedMetrics = result;
        this.getPlantMetrics();
      }, error => {
        this._loadPanelServive.hide();
        this._errorNotificationService.error("Failed", this.name, error);
      });
    }
  }

  getIp21Tags() {
    if (this.plantId) {
      this._eventConfigurationDetailService.getIp21Tags(this.plantId).subscribe(response => {
        this._loadPanelServive.hide();
        this.ip21StartTags = response.result.filter(f => f.map === this.ipTextMap);
        this.ip21EndTags = response.result.filter(f => f.map === this.ipTextMap);
      }, error => {
        this._loadPanelServive.hide();
        this._errorNotificationService.error("Failed", this.name, error);
      });
    }
  }

  getPlantMetrics() {
    if (this.plantId) {
      this._loadPanelServive.show();
      this._eventConfigurationDetailService.getPlantMetricDetails(this.plantId).subscribe(result => {
        this._loadPanelServive.hide();
        this.allMetrics = result.filter(r => !this.assignedMetrics.find(f => f.PlantMetricId === r.PlantMetricId));
      }, error => {
        this._loadPanelServive.hide();
        this._errorNotificationService.error("Failed", this.name, error);
      })
    }
  }

  onEventCategoryChanged(e) {
    if (e.value) {
      this.setEventCategoryDescription(e.value);
    }
  }

  add() {
    this.availableGrid.instance.getSelectedRowKeys().then((selectedIds) => {
      for (let id of selectedIds) {
        let row = this.allMetrics.find(f => f.PlantMetricId === id);
        if (row) {
          this.assignedMetrics.push(row);
        }
      }
      this.allMetrics = this.allMetrics.filter(f => !selectedIds.some(s => s === f.PlantMetricId));
      this.clearSelection();
    });
  }

  clearSelection() {
    this.availableGrid.instance.clearSelection();
    this.assignedGrid.instance.clearSelection();
  }

  remove() {
    this.assignedGrid.instance.getSelectedRowKeys().then((selectedIds) => {
      for (let id of selectedIds) {
        let row = this.assignedMetrics.find(f => f.PlantMetricId === id);
        if (row) {
          this.allMetrics.push(row);
        }
      }
      this.assignedMetrics = this.assignedMetrics.filter(f => !selectedIds.some(s => s === f.PlantMetricId));
      this.clearSelection();
    });
  }

  submitForm(e) { 
    var result = this.validationGroup.instance.validate();
    if (this.eventConfiguration.EventSourceId === 1) {
      if (!this.validateIp21Tags()) {
        return;
      }
    }
    if (result.isValid) {
      this._loadPanelServive.show();
      if (this.eventConfiguration.Id) {
        this.update();
      } else {
        this.insert();
      } 
    }
  }

  validateIp21Tags() : boolean {
    if (!this.eventConfiguration.StartIp21Tag || this.eventConfiguration.StartIp21Tag === '' || !this.eventConfiguration.EndIp21Tag || this.eventConfiguration.EndIp21Tag === '') {
      this._toastService.error("Start and end IP21 tags are required.");
      return false;
    }

    if (this.eventConfiguration.StartIp21Tag === this.eventConfiguration.EndIp21Tag) {
      this._toastService.error("Start and end IP21 must be different.");
      return false;
    }

    return true;
  }

  insert() {
    this._loadPanelServive.show();
    this._eventConfigurationDetailService.insertEventConfiguration(this.eventConfiguration).subscribe(result => {
      this._loadPanelServive.hide();
      this._toastService.success("Event configuration inserted successfully.");
      this.eventConfiguration.Id = result.Id;
      this.addEventConfigurationCollectionMetrics();
    }, error => {
      this._loadPanelServive.hide();
      this._errorNotificationService.error("Failed", this.name, error);
    })
  }

  update() {
    this._loadPanelServive.show();
    this._eventConfigurationDetailService.updateEventConfiguration(this.eventConfiguration).subscribe(result => {
      this._loadPanelServive.hide();
      this._toastService.success("Event configuration updated successfully.");
      this.deleteEventConfigurationCollectionMetrics();
    }, error => {
      this._loadPanelServive.hide();
      this._errorNotificationService.error("Failed", this.name, error);
    })
  }

  deleteEventConfigurationCollectionMetrics() {
    this._loadPanelServive.show();
    this._eventConfigurationDetailService.deletealleventconfigurationcollectionmetricsbyeventconfigurationid(this.eventConfiguration.Id).subscribe(result => {
      this._loadPanelServive.hide();
      this.addEventConfigurationCollectionMetrics();
    }, error => {
      this._loadPanelServive.hide();
      this._errorNotificationService.error("Failed", this.name, error);
    });
  }

  addEventConfigurationCollectionMetrics() {
    for (let row of this.assignedMetrics) {
      this._loadPanelServive.show();
      let er: EventConfigurationCollectionMetrics = new EventConfigurationCollectionMetrics;
      er.EventConfigurationId = this.eventConfiguration.Id;
      er.PlantMetricId = row.PlantMetricId;
      this._eventConfigurationDetailService.inserteventconfigurationcollectionmetrics(er).subscribe(result => {
        this._loadPanelServive.hide();
      }, error => {
        this._loadPanelServive.hide();
        this._errorNotificationService.error("Failed", this.name, error);
      })
    }
  }

  onStartIp21TagChanged(e) {
    if (e.value) {
      this.eventConfiguration.StartIp21Tag = e.value;
    }
  }

  onEndIp21TagChanged(e) {
    if (e.value) {
      this.eventConfiguration.EndIp21Tag = e.value;
    }
  }

  addCustomItemStart(data) {
    if (this.addCustom(data, this.ip21StartTags))
      this.eventConfiguration.StartIp21Tag = data.text;
  }

  addCustomItemEnd(data) {
    if (this.addCustom(data, this.ip21EndTags))
      this.eventConfiguration.EndIp21Tag = data.text;
  }

  addCustom(data, list: Ip21Tag[]) : boolean {
    if (!data.text) {
      data.customItem = null;
      return false;
    }
    if (!list.some(s => s.name === data.text))
      list.push( { id: 0, name: data.text, type: this.ipTextMap } as Ip21Tag );
    return true;
  }
}
