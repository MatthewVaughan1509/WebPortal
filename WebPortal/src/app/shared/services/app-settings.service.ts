import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  private settings: AppSetings;

  constructor() { }

  setSettings(): Promise<AppSetings> {
    return fetch(
      'config/appsettings.json',
      {
        method: "GET",
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    ).then(response => response.json())
      .then(sett => {
        this.settings = sett;
        return this.settings;
      });
  }

  readSettings(): AppSetings {
    return this.settings;
  }
}

export class AppSetings {
  stage: string;
  build: string;
  insightsApiUrl: string;
  insightsApiScope: string;
  plantDataCoreUrl: string;
  appId: number;
  ip21Url: string;
  chartUrl: string;
  clientId: string;
}
