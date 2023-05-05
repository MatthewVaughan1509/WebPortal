import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IngestionPlantMetricNotProcessing } from 'src/app/entities/ingestionPlantMetricNotProcessing';
import { RouteUrl } from 'src/app/entities/routeUrl';
import { ErrorNotificationService } from 'src/app/shared/components/error-notification/error-notification.service';
import { LoadPanelService } from 'src/app/shared/components/load-panel/load-panel.service';
import { IngestionPlantMetricReportService } from './ingestion-plant-metric-report.service';

@Component({
  selector: 'app-ingestion-plant-metric-report',
  templateUrl: './ingestion-plant-metric-report.component.html',
  styleUrls: ['./ingestion-plant-metric-report.component.scss']
})
export class IngestionPlantMetricReportComponent implements OnInit {

  constructor(private _ingestionPlantMetricReportService: IngestionPlantMetricReportService, private _errorNotificationService: ErrorNotificationService, private _loadPanelServive: LoadPanelService, private route: ActivatedRoute) { }

  tabs: any[] = [];
  activeTab: number = 0;
  gridHeight: string;
  ingestionMetricsNotProcessing : IngestionPlantMetricNotProcessing[] = [];
  inActiveIngestionMetrics:  IngestionPlantMetricNotProcessing[] = [];

  mostDelayedTimeStamp: Date;

  get routeUrl(): string {
    return this.route.snapshot?.data?.['url'] || RouteUrl.IngestionPlantMetricNotProcessing;
  }

  ngOnInit(): void {
    this.tabs = this._ingestionPlantMetricReportService.getTabs();
    this.gridHeight = `${window.innerHeight / 1.4}px`
    this.getReportData();
  }

  getReportData() {
    this._loadPanelServive.show();
    this._ingestionPlantMetricReportService.getReportData().subscribe(result => {
      this._loadPanelServive.hide();
      this.inActiveIngestionMetrics = result.InActiveIngestionMetrics;
      this.ingestionMetricsNotProcessing = result.IngestionMetricsNotProcessing;
      this.mostDelayedTimeStamp = result.MostDelayedTimeStamp;
    }, error => {
      this._loadPanelServive.hide();
      this._errorNotificationService.error("Failed", "", error);
    });
  }

  onExportingActive(data: any) {
    data.fileName = this.getExportFileName(false);
  }

  onExportingInActive(data: any) {
    data.fileName = this.getExportFileName(true);
  }

  getExportFileName(inActive: boolean) : string {
    return `Insights - ${inActive ? "InActive" : "Active"} Ingestion Plant Metrics Not Processing`;
  }

}
