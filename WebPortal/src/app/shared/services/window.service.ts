import { Injectable } from '@angular/core';
import { AppSetings, AppSettingsService } from "./app-settings.service";

@Injectable()
export class WindowService {

  appSettings: AppSetings;

  constructor(private appSettingsService: AppSettingsService) {
    this.appSettings = this.appSettingsService.readSettings(); 
  }

  open(url: string) {
    window.open(`${document.baseURI}${url}`, '_blank');
  }

}
