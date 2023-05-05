import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DxDataGridComponent, DxTooltipComponent } from 'devextreme-angular';
import { forkJoin } from 'rxjs';
import { LocalStorage } from 'src/app/common/util/local-storage';
import { Actions } from 'src/app/entities/actions';
import { IngestionFrequency } from 'src/app/entities/ingestionFrequency';
import { IngestionInterval } from 'src/app/entities/ingestionInterval';
import { PlantMetric } from 'src/app/entities/PlantMetric';
import { RouteUrl } from 'src/app/entities/routeUrl';
import { ErrorNotificationService } from 'src/app/shared/components/error-notification/error-notification.service';
import { LoadPanelService } from 'src/app/shared/components/load-panel/load-panel.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { PermissionsService } from 'src/app/shared/services/permissions.service';
import { IngestionPlantMetricService } from './ingestion-plant-metric.service';
import { Defaults } from 'src/app/entities/defaults';
import { dateTime } from 'src/app/common/util/date-time';
import { IngestionPlantMetric } from 'src/app/entities/ingestionPlantMetric';
import { IngestionMovingAverage } from 'src/app/entities/ingestionMovingAverage';

@Component({
  selector: 'app-ingestion-plant-metric',
  templateUrl: './ingestion-plant-metric.component.html',
  styleUrls: ['./ingestion-plant-metric.component.scss']
})
export class IngestionPlantMetricComponent implements OnInit {

  constructor(private _trackedMetricsService: IngestionPlantMetricService, private _errorNotificationService: ErrorNotificationService, private _loadPanelServive: LoadPanelService, private _toastService: ToastService, private _permissionsService: PermissionsService, private route: ActivatedRoute) {
  }

  @ViewChild('availableGridRef', { static: false }) availableGrid: DxDataGridComponent;
  @ViewChild('trackedGridRef', { static: false }) trackedGrid: DxDataGridComponent;
  @ViewChild(DxTooltipComponent) tooltip: DxTooltipComponent;

  plantId: number;

  tabs: any[] = [];
  activeTab: number = 1;

  gridHeight: string;
  allMetrics: PlantMetric[] = [];
  trackedMetrics: IngestionPlantMetric[] = [];
  ingestionFrequencies: IngestionFrequency[];
  ingestionMovingAverages: IngestionMovingAverage[];
  ingestionIntervals: IngestionInterval[];

  isDisabled: boolean = true;
  focusedRowEnabled: boolean = false;
  selectionMode: string;

  toolTipMessage: string;

  hasEditPermission: boolean = false;

  get routeUrl(): string {
    return this.route.snapshot?.data?.['url'] || RouteUrl.IngestionPlantMetric;
  }

  ngOnInit(): void {
    this.plantId = LocalStorage.getPlantId();
    this.checkHasPermission();
    this.getFormData();
    this.tabs = this._trackedMetricsService.getTabs();
    this.gridHeight = `${window.innerHeight / 1.5}px`
  }

  checkHasPermission() {
    this.selectionMode = "none";
    this.focusedRowEnabled = true;
    if (this.plantId) {
      this._permissionsService.getPermissionForPageByPlant(this.plantId, this.routeUrl).subscribe(permission => {
        if (permission) {
          this.hasEditPermission = permission.PageActions.some(x => x.Name == Actions.Edit && x.HasAccess);
          this.selectionMode = this.hasEditPermission ? "multiple" : "none";
          this.isDisabled = !this.hasEditPermission;
          this.focusedRowEnabled = this.hasEditPermission;
        }
      }, error => {
        this._errorNotificationService.error("Failed", "", error);
      });
    }
  }

  changePlant(e) {
    if (e) {
      this.plantId = e;
      this.checkHasPermission();
      this.getGridDataForPlant();
    }
  }

  getFormData() {
    this._loadPanelServive.show();
    forkJoin([
      this._trackedMetricsService.getAllIngestionFrequency(),
      this._trackedMetricsService.getAllIngestionInterval(),
      this._trackedMetricsService.getAllIngestionMovingAverages()
    ]).subscribe(results => {
      this._loadPanelServive.hide();
      if (results) {
        if (results.length > 0) {
          this.ingestionFrequencies = results[0];
        }
        if (results.length > 1) {
          this.ingestionIntervals = results[1];
        }
        if (results.length > 2) {
          this.ingestionMovingAverages = results[2];
        }
      }
    }, error => {
      this._loadPanelServive.hide();
      this._errorNotificationService.error("Failed", "", error);
    });
    if (this.plantId) {
      this.getGridDataForPlant();
    }
  }

  getGridDataForPlant() {
    if (this.plantId) {
      this.getMetrics();
    }
  }

  getMetrics() {
    this._loadPanelServive.show();
    this._trackedMetricsService.getPlantMetricDetails(this.plantId).subscribe(result => {
      this._loadPanelServive.hide();
      this.allMetrics = result;
      this.getTrackedMetrics();
    }, error => {
      this._loadPanelServive.hide();
      this._errorNotificationService.error("Failed", "", error);
    });
  }

  getTrackedMetrics() {
    this._loadPanelServive.show();
    this._trackedMetricsService.getIngestionPlantMetricbyPlant(this.plantId).subscribe(result => {
      this._loadPanelServive.hide();
      this.trackedMetrics = result;
      this.allMetrics = this.allMetrics.filter(f => !this.trackedMetrics.some(s => s.PlantMetricId === f.PlantMetricId));
    }, error => {
      this._loadPanelServive.hide();
      this._errorNotificationService.error("Failed", "", error);
    })
  }

  add() {
    this.availableGrid.instance.getSelectedRowKeys().then((selectedIds) => {
      let newMetrics: IngestionPlantMetric[] = [];
      if (selectedIds.length > 0) {
        this._loadPanelServive.show();
      }
      for (let id of selectedIds) {
        let row = this.allMetrics.find(f => f.PlantMetricId === id);
        if (row) {
          var ingestionPlantMetric = new IngestionPlantMetric();
          ingestionPlantMetric.PlantMetricId = row.PlantMetricId;
          ingestionPlantMetric.MetricGroupName = row.MetricGroupName;
          ingestionPlantMetric.MetricName = row.MetricName;
          ingestionPlantMetric.IngestionFrequencyId = Defaults.IngestionFrequencyId;
          ingestionPlantMetric.IngestionIntervalId = Defaults.IngestionIntervalId;
          ingestionPlantMetric.InActive = false;
          newMetrics.push(ingestionPlantMetric);
        }
      }
      if (newMetrics.length > 0) {
        this._trackedMetricsService.insertIngestionPlantMetric(newMetrics).subscribe(result => {
          this._loadPanelServive.hide();
          this.getGridDataForPlant();
        }, error => {
          this._loadPanelServive.hide();
          this._errorNotificationService.error("Failed", "", error);
        })
      }
    });
    this.clearSelection();
  }

  remove() {
    this.trackedGrid.instance.getSelectedRowKeys().then((selectedIds) => {
      let trackedMetricsToRemove: IngestionPlantMetric[] = [];
      if (selectedIds.length > 0) {
        this._loadPanelServive.show();
      }
      for (let id of selectedIds) {
        let row = this.trackedMetrics.find(f => f.Id === id);
        if (row) {
          trackedMetricsToRemove.push(row);
        }
      }
      if (trackedMetricsToRemove.length > 0) {
        this._trackedMetricsService.deleteIngestionPlantMetric(trackedMetricsToRemove).subscribe(result => {
          this._loadPanelServive.hide();
          this.getGridDataForPlant();
        }, error => {
          this._loadPanelServive.hide();
          this._errorNotificationService.error("Failed", "", error);
        })
      }
    });
    this.clearSelection();
  }

  onRowUpdated(e) {
    let dataRow = e.data;
    this._loadPanelServive.show();
    this._trackedMetricsService.updateIngestionPlantMetric(dataRow).subscribe(result => {
      this._loadPanelServive.show();
      this.getGridDataForPlant();
    }, error => {
      this._loadPanelServive.hide();
      this._errorNotificationService.error("Failed", "", error);
    })
  }

  clearSelection() {
    this.availableGrid.instance.clearSelection();
    this.trackedGrid.instance.clearSelection();
  }

  // If the row is active and the lastIngestedTimeStamp < Current UTC by more than the the ingestion frequency + 15 minutes then
  // set the row background colour to red.
  onRowPrepared(e) {
    let fifteenMinutes: number = (15 * 60 * 1000);
    if (e.rowType === "data" && !e.data.InActive) {
      let row = e.data;
      if (row.LastIngestedTimeStamp) {
        let currentUtc = dateTime.getDateUtc();
        let lastIngestedTimeStampUtc = dateTime.getDateUtc(new Date(row.LastIngestedTimeStamp));
        let diff = (row.Seconds * 1000) + fifteenMinutes;
        if (currentUtc - lastIngestedTimeStampUtc > diff) {
          e.rowElement.style.backgroundColor = "#f25e5c";
        }
      }
    }
  }

  onExporting(data: any) {
    data.fileName = "Insights - Tracked Metrics ";
  }

  onCellPrepared(e) {
    if (e.rowType == "data") {
      var data = e.data;
      if (e.column.dataField == "Id") {
        e.cellElement.addEventListener("mousemove", (event) => {
          this.toolTipMessage = `<b>Inserted By ${data.InsertedBy}<br/>Inserted On ${new Date(data.InsertedOn).toLocaleString()}`;
          if (data.ModifiedBy) {
            this.toolTipMessage = this.toolTipMessage.concat(`<br/>Modified By ${data.ModifiedBy ? data.ModifiedBy : ""}<br/>Modified On ${data.ModifiedOn ? new Date(data.ModifiedOn).toLocaleString() : ""}`);
          }
          this.toolTipMessage.concat("</b><br />");
          this.tooltip.instance.option("target", e.cellElement);
          this.tooltip.instance.show();
        });
        e.cellElement.addEventListener("mouseout", (event) => {
          this.tooltip.instance.hide();
        });
      }
    }
  }

}
