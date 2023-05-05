import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { ErrorNotificationService } from '../components/error-notification/error-notification.service';
import { LocalStorage } from 'src/app/common/util/local-storage';
import { Region } from 'src/app/entities/region';
import { Plant } from 'src/app/entities/plant';
import { LoadPanelService } from '../components/load-panel/load-panel.service';

@Component({
  selector: 'app-region-plant-search',
  templateUrl: './region-plant-search.component.html',
  styleUrls: ['./region-plant-search.component.scss']
})
export class RegionPlantSearchComponent implements OnInit {

  constructor(private _commonService: CommonService, private _errorNotificationService: ErrorNotificationService, private _loadPanelService: LoadPanelService) {
  }

  @Output()
  changePlant: EventEmitter<any> = new EventEmitter();

  regions: Region[] = [];
  plants: Plant[] = [];
  regionId: number;
  plantId: number;
  headerWidth: string = "700px";
  componentName: string = "Region Plant Search";

  ngOnInit(): void {
    this.getRegions();
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
    }, error => {
      this._loadPanelService.hide();
      this._errorNotificationService.error("Failed", this.componentName, error);
    });
  }

  onRegionChanged(e) {
    this.regionId = e.value;
    LocalStorage.setRegionId(this.regionId);
    this.getPlantsByregionId();
  }

  getPlantsByregionId() {
    this._loadPanelService.show();
    this._commonService.getPlantByRegionId(this.regionId).subscribe((plants: Plant[]) => {
      this._loadPanelService.hide();
      this.plants = plants;
    }, error => {
      this._errorNotificationService.error("Failed", this.componentName, error);
    });
  }

  onPlantChanged(e) {
    this.plantId = e.value;
    if (this.plantId) {
      LocalStorage.setPlantId(this.plantId);
      this.changePlant.emit(this.plantId);
    }
  }
}
