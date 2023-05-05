import { Component, OnInit, ViewChild } from '@angular/core';
import { PlantAndEventCategoryService } from './plant-and-event-category.service';
import { ErrorNotificationService } from 'src/app/shared/components/error-notification/error-notification.service';
import { LocalStorage } from '../../../common/util/local-storage';
import { LoadPanelService } from 'src/app/shared/components/load-panel/load-panel.service';
import { Region } from 'src/app/entities/region';
import { Plant } from 'src/app/entities/plant';
import { CommonService } from 'src/app/shared/services/common.service';
import { EventReportData } from 'src/app/entities/eventReportData';
import { dateTime } from 'src/app/common/util/date-time';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { Actions } from '../../../entities/actions';
import { RouteUrl } from '../../../entities/routeUrl';
import { PermissionsService } from 'src/app/shared/services/permissions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DxTooltipComponent } from 'devextreme-angular';
import { DatePipe } from '@angular/common';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { TagExtension } from 'src/app/entities/tag-extension';
import { EquipmentTag } from 'src/app/entities/equipmentTag';

@Component({
  selector: 'report-by-plant-and-event-category',
  templateUrl: './plant-and-event-category.component.html',
  styleUrls: ['./plant-and-event-category.component.scss']
})
export class PlantAndEventCategoryComponent implements OnInit {
  @ViewChild(DxTooltipComponent) tooltip: DxTooltipComponent;
  regions: Region[] = [];
  plants: Plant[] = [];
  eventCategories: any[] = [];
  regionId: number;
  plantId: number;
  eventCategoryId: number;
  insertMessage: string;
  updateMessage: string;
  equipmentTagId: number;

  columns: any[] = [];
  metrics: any[] = [];
  metricReportData: EventReportData["EventDetails"][];

  dateEnd: Date = new Date();
  dateInit: Date = new Date();
  isEndDateValid: boolean = true;
  isStartDateValid: boolean = true;
  startDateValidation: any;
  endDateValidation: any;
  isPlantValid: boolean = true;
  isRegionValid: boolean = true;
  isEventCategoryValid: boolean = true;
  plantRequired: any;
  regionRequired: any;
  eventCategoryRequired: any;
  equipmentTags: EquipmentTag[] = [];

  headerWidth: string = "700px";
  pageTitle: string = "PPM Insights > Reports > By Plant & Event Category";

  hasViewPermission: boolean = false;
  chartUrl: string = '';

  private _format: string = dateTime.getDateFormat();
  get format(): string {
    return this._format;
  }
  set format(value: string) {
    this._format = value;
  }

  constructor(private _plantAndEventCategoryService: PlantAndEventCategoryService, private _commonService: CommonService, private _errorNotificationService: ErrorNotificationService, private _loadPanelService: LoadPanelService, private _toastService: ToastService, private _permissionsService: PermissionsService, private route: ActivatedRoute, private router: Router, private datePipe: DatePipe, private appSettingsService: AppSettingsService) {
    this.dateInit.setDate(this.dateEnd.getDate() - 1);
    let appSettings = this.appSettingsService.readSettings();
    this.chartUrl = appSettings.chartUrl;
  }

  get routeUrl(): string {
    return this.route.snapshot?.data?.['url'] || RouteUrl.ReportByPlantAndEventCategory;
  }

  ngOnInit(): void {
    this.checkHasPermission();
    this.getRegions();
    this.getEventCategories();
    this.getEquipmentTags();
  }

  checkHasPermission() {
    let permission: any = this._permissionsService.getPermissionForActionsByRoute(this.routeUrl);
    if (permission) {
      this.hasViewPermission = permission.PageActions.some(x => x.Name == Actions.View && x.HasAccess);
      if (!this.hasViewPermission) {
        this.router.navigate([RouteUrl.Unauthorized]);
      }
    }
    else {
      this.router.navigate([RouteUrl.Unauthorized]);
    }
  }

  getRegions() {
    this.regionId = LocalStorage.getRegionId();
    this.plantId = LocalStorage.getPlantId();

    if (this.regionId && this.plantId) {
      this.getPlantsByregionId();
    }

    this._loadPanelService.show();
    this._commonService.getAllRegions().subscribe((regions: Region[]) => {
      this._loadPanelService.hide();
      this.regions = regions;
      this._format = dateTime.getDateFormat();
    }, error => {
      this._loadPanelService.hide();
      this._errorNotificationService.error("Failed", "Region Plant Search", error);
    });
  }

  getEquipmentTags() {
    this._loadPanelService.show();
    this._plantAndEventCategoryService.getAllEquipmentTag().subscribe((equipmentTags: EquipmentTag[]) => {
      this._loadPanelService.hide();
      this.equipmentTags = equipmentTags;
    }, error => {
      this._loadPanelService.hide();
      this._errorNotificationService.error("Failed", "Equipment Tag Search", error);
    });
  }

  getDateFormat(): string {
    let f = "yyyy-MM-dd";
    if (this.regionId) {
      let selectedRegion = this.regions.find(r => r.Id == this.regionId);
      if (selectedRegion) {
        return dateTime.getRegionDateFormat(selectedRegion.Name);
      }
    }
    return f;
  }

  formatDate(d: Date): string {
    if (this.regionId) {
      let selectedRegion = this.regions.find(r => r.Id == this.regionId);
      if (selectedRegion) {
        let format = dateTime.getRegionDateTimeFormat();
        return this.datePipe.transform(d, format);
      }
    }
    return d.toLocaleDateString();
  }

  showTooltip(e) {
    if (e.column.dataField == "Info") {
      if (e.data.InsertedOn) {
        var insertedOn = this.formatDate(e.data.InsertedOn);
      }

      if (e.data.InsertedBy) {
        this.insertMessage = "Inserted: " + e.data.InsertedBy + " on " + insertedOn;
      } else {
        this.insertMessage = "Inserted: Details not available";
      }

      if (e.data.ModifiedOn) {
        var modifiedOn = this.formatDate(e.data.ModifiedOn);
      }

      if (e.data.ModifiedBy) {
        this.updateMessage = "Modified: " + e.data.ModifiedBy + " on " + modifiedOn;
      } else {
        this.updateMessage = "Modified: Details not available";
      }
      this.tooltip.instance.option("target", e.cellElement);
      this.tooltip.instance.show();
    }
  }

  hideTooltip(e) {
    this.tooltip.instance.hide();
  }

  onCellPrepared(e) {
    if (e.rowType == "data") {
      if (e.column.dataField == "Start Time" || e.column.dataField == "End Time") {
        e.cellElement.innerHTML = this.formatDate(e.value);
      }
    }
  }

  onRegionChanged(e) {
    this.regionId = e.value;
    LocalStorage.setRegionId(this.regionId);
    this._format = dateTime.getDateFormat();
    this.getPlantsByregionId();
  }

  getPlantsByregionId() {
    this._loadPanelService.show();
    this._commonService.getPlantByRegionId(this.regionId).subscribe((plants: Plant[]) => {
      this._loadPanelService.hide();
      this.plants = plants;
    }, error => {
      this._errorNotificationService.error("Failed", "Region Plant Search", error);
    });
  }

  onPlantChanged(e) {
    this.plantId = e.value;
    if (this.plantId) {
      LocalStorage.setPlantId(this.plantId);
    }
  }

  onStartDateChanged(e) {
    this.dateInit = e.value;
  }

  onEndDateChanged(e) {
    this.dateEnd = e.value;
  }

  getExcelFileName() {
    let date = new Date();
    let currentMonth = ("0" + (date.getMonth() + 1)).slice(-2);
    let dateTime = date.getFullYear() + "" + currentMonth + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes();

    let fileName = "Report_By_Plant_&_Event_Category_" + dateTime;
    return fileName;
  }

  onEventCategoryChanged(e) {
    this.eventCategoryId = e.value;
    if (this.eventCategoryId) {
      LocalStorage.setEventCategoryId(this.eventCategoryId);
    }
  }

  onEquipmentTagChanged(e) {
    this.equipmentTagId = e.value;
  }

  getEventCategories() {
    this.eventCategoryId = LocalStorage.getEventCategoryId();
    this._plantAndEventCategoryService.getAllEventCategories().subscribe((result: any[]) => {
      this._loadPanelService.hide();
      this.eventCategories = result;
    }, error => {
      this._loadPanelService.hide();
      this._errorNotificationService.error("Failed", "Event Categories", error);
    });
  }


  getDate(date: Date): string {
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + (date.getDate())).slice(-2);
    var d = date.getFullYear().toString() + month + day;
    return d;
  }

  prepareColumns(data) {
    this.columns = [];
    this.columns.push({ field: 'Info', cap: '', fixed: true });
    if (data) {
      data.forEach(columnItem => {
        let column;
        if (columnItem != 'InsertedOn' && columnItem != 'InsertedBy' && columnItem != 'ModifiedOn' && columnItem != 'ModifiedBy') {
          if (this.columns.indexOf(columnItem) == -1) {
            if (columnItem == 'Plant Name' || columnItem == 'Equipment Tag')
              column = { field: columnItem, cap: columnItem, fixed: true, dataType: 'string' }
            else if (columnItem == 'Start Time' || columnItem == 'End Time')
              column = { field: columnItem, cap: columnItem, fixed: true, dataType: 'datetime' }
            else if (columnItem == 'PPM ID #')
              column = { field: columnItem, cap: columnItem, fixed: true, dataType: 'number' }
            else
              column = { field: columnItem, cap: columnItem, fixed: false, dataType: 'number' }
            this.columns.push(column);
          }
        }
      });
    }
  }

  checkPlant(): boolean {
    if (isNaN(this.plantId) || this.plantId <= 0) {
      this.plantRequired = { message: "Plant is required" };
      this.isPlantValid = false;

      return false;
    }
    this.isPlantValid = true;
    return true;
  }

  checkRegion(): boolean {
    if (isNaN(this.regionId) || this.regionId <= 0) {
      this.regionRequired = { message: "Region is required" };
      this.isRegionValid = false;
      return false;
    }
    this.isRegionValid = true;
    return true;
  }

  checkEventCategory(): boolean {
    if (isNaN(this.eventCategoryId) || this.eventCategoryId <= 0) {
      this.eventCategoryRequired = { message: "Event Category is required" };
      this.isEventCategoryValid = false;
      return false;
    }
    this.isEventCategoryValid = true;
    return true;
  }

  checkStartDate(): boolean {
    if (this.dateInit == null) {
      this.startDateValidation = { message: "Start date is required" };
      this.isStartDateValid = false;

      return false;
    }
    this.isStartDateValid = true;
    return true;
  }

  checkEndDate(): boolean {
    if (this.dateEnd == null) {
      this.endDateValidation = { message: "End date is required" };
      this.isEndDateValid = false;

      return false;
    }
    this.isEndDateValid = true;
    return true;
  }

  checkValidDate(): boolean {
    if (this.dateInit > this.dateEnd) {
      this.startDateValidation = { message: "Start date should be less than End date" };
      this.endDateValidation = { message: "End date should be greater than Start date" };
      this.isStartDateValid = false;
      this.isEndDateValid = false;

      return false;
    }
    this.isStartDateValid = true;
    this.isEndDateValid = true;
    return true;
  }

  loadClick() {

    if (!this.checkRegion()) return;
    if (!this.checkPlant()) return;
    if (!this.checkEventCategory()) return;
    if (!this.checkStartDate()) return;
    if (!this.checkEndDate()) return;
    if (!this.checkValidDate()) return;

    this._loadPanelService.show();
    this._plantAndEventCategoryService.getReportByPlantAndCategory(this.plantId, this.eventCategoryId, this.equipmentTagId, this.getDate(this.dateInit), this.getDate(this.dateEnd)).subscribe(result => {
      if (!result) {
        this._loadPanelService.hide();
        this.columns = [];
        this.metricReportData = [];
        this.metrics = [];
        this._loadPanelService.hide();
        this._toastService.info("Plant & Event Category report data not found for selected date range.");
        return;
      }
      else {
        this.prepareColumns(result.AllColumns);
        this.metricReportData = result.EventDetails;
        this.metrics = result.Metrics;
        this._loadPanelService.hide();
      }
    }, error => {
      this._errorNotificationService.error("Failed", "Report by Plant and Event Category", error);
      this._loadPanelService.hide();
    });
  }

  customizeColumns(columns) {
    if (columns.length) {
      columns.forEach(element => {
        if (element.dataField == 'Plant Name' || element.dataField == 'Start Time' || element.dataField == 'End Time') {
          element.headerCellTemplate = element.caption;
        }
        else {
          let headerCellTemplate = '';
          var captionSplit = element.dataField.split("|");
          headerCellTemplate = captionSplit[0];
          if (captionSplit[1] && captionSplit[1] != '') {
            headerCellTemplate = headerCellTemplate + "<br/><div style='color: #337ab7'>" + captionSplit[1] + "</div>";
          }
          element.headerCellTemplate = headerCellTemplate;
        }
      });
    }
  }

  getChartUrl(d) {
    let startDate = this.getStartAndEndDate(d.key['Start Time'], 'start');
    let endDate = this.getStartAndEndDate(d.key['End Time'], 'end');
    let plantName = d.key['Plant Name'];
    let metrices = [];
    let ext;
    if (this.metrics.length > 0) {
      this.metrics.forEach(element => {
        ext = `${(element.FrequencyId == 0 ? (element.ResultTypeName.toLowerCase() == 'actual' ? TagExtension.KPIValue : TagExtension.KPITarget) : (element.ResultTypeName.toLowerCase() == 'actual' ? TagExtension.DailyKPI : TagExtension.DailyKPITarget))}`;
        metrices.push(`[${this.plantId}--${element.MetricName}.${ext}--${element.MetricGroupName.toLowerCase() == 'filling transaction' ? 0 : 1}]`);
      });
    }
    return `${this.chartUrl}/#/chart?series=${metrices.join(',')}&startdate=${startDate}&enddate=${endDate}&title=Batch Fill Report Chart - ${plantName}&axis=multi&autoload=true`;
  }

  getStartAndEndDate(d, dateType: string) {
    d = new Date(d);
    let date = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`;
    let month = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
    let hour = d.getHours() > 9 ? d.getHours() : `0${d.getHours()}`;
    let minute = d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`;
    let second = d.getSeconds() > 9 ? d.getSeconds() : `0${d.getSeconds()}`;

    if (dateType == 'start')
      return new Date(d.getFullYear(), month, date, hour, minute - 1, second);
    else
      return new Date(d.getFullYear(), month, date, hour, minute + 1, second);
  }
}