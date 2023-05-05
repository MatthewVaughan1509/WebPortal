import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { DxAccordionModule, DxBoxModule, DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxFormModule, DxLoadPanelModule, DxMenuModule, DxTabPanelModule, DxTextAreaModule, DxTextBoxModule, DxPopupModule, DxSelectBoxModule, DxToastModule, DxTooltipModule, DxValidatorModule, DxValidationGroupModule, DxDateBoxModule } from 'devextreme-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppSettingsService } from './shared/services/app-settings.service';
import { HomeComponent } from './pages/home/home.component';
import { ErrorNotificationComponent } from './shared/components/error-notification/error-notification.component';
import { WindowService } from './shared/services/window.service';
import { SideNavMenuModule } from '@ppm/side-nav-menu';
import { EventConfigurationComponent } from './pages/event-configuration/event-configuration.component';
import { EventConfigurationService } from './pages/event-configuration/event-configuration.service';
import { LoadPanelComponent } from './shared/components/load-panel/load-panel.component';
import { LoadPanelService } from './shared/components/load-panel/load-panel.service';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ToastService } from './shared/components/toast/toast.service';
import { RegionPlantSearchComponent } from './shared/region-plant-search/region-plant-search.component';
import { CommonService } from './shared/services/common.service';
import { EventConfigurationDetailComponent } from './pages/event-configuration-detail/event-configuration-detail.component';
import { EventConfigurationDetailService } from './pages/event-configuration-detail/event-configuration-detail.service';
import { TopNavMenuModule } from '@ppm/top-nav-menu';
import { MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalModule, MsalRedirectComponent, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { BrowserCacheLocation, Configuration, InteractionType, IPublicClientApplication, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { AuthGuardService } from './shared/services/auth.service';
import { PermissionsService } from './shared/services/permissions.service';
import { PermissionGuardService } from './shared/services/permission-guard.service';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { PlantAndEventCategoryComponent } from './pages/reports/plant-and-event-category/plant-and-event-category.component';
import { IngestionPlantMetricComponent } from './pages/ingestion-plant-metric/ingestion-plant-metric.component';
import { IngestionPlantMetricService } from './pages/ingestion-plant-metric/ingestion-plant-metric.service';

export function setSettings(configService: AppSettingsService) {
  return () => configService.setSettings();
}

/**
 * Here we pass the configuration parameters to create an MSAL instance.
 * For more info, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/configuration.md
 */
export function MSALInstanceFactory(configService: AppSettingsService): IPublicClientApplication {
  let appSettings = configService.readSettings();
  const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

  /**
   * Configuration object to be passed to MSAL instance on creation. 
   * For a full list of MSAL.js configuration parameters, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
   */
  const msalConfig: Configuration = {
    auth: {
      clientId: appSettings.clientId, // This is the ONLY mandatory field that you need to supply.
      authority: 'https://login.microsoftonline.com/950af356-6025-4fdb-96a0-a9be6b893fec', // Defaults to "https://login.microsoftonline.com/common"
      redirectUri: document.baseURI, // Points to window.location.origin. You must register this URI on Azure portal/App Registration.
      navigateToLoginRequestUrl: false
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
      storeAuthStateInCookie: isIE, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
      loggerOptions: {
        loggerCallback(logLevel: LogLevel, message: string) {
          //console.log(message);
        },
        logLevel: LogLevel.Verbose,
        piiLoggingEnabled: false
      }
    }
  };

  return new PublicClientApplication(msalConfig);
}

/**
 * MSAL Angular will automatically retrieve tokens for resources 
 * added to protectedResourceMap. For more info, visit: 
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/initialization.md#get-tokens-for-web-api-calls
 */
export function MSALInterceptorConfigFactory(configService: AppSettingsService): MsalInterceptorConfiguration {
  let appSettings = configService.readSettings();

  /**
   * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
   */
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me/photos/*', ['user.read']);
  protectedResourceMap.set(`${appSettings.insightsApiUrl}api/*`, [appSettings.insightsApiScope]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: ['user.read']
};

/**
 * Set your default interaction type for MSALGuard here. If you have any
 * additional scopes you want the user to consent upon login, add them here as well.
 */
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: loginRequest
  };
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorNotificationComponent,
    EventConfigurationComponent,
    LoadPanelComponent,
    ToastComponent,
    RegionPlantSearchComponent,
    EventConfigurationDetailComponent,
    UnauthorizedComponent,
    PlantAndEventCategoryComponent,
    IngestionPlantMetricComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MsalModule,
    DxBoxModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxDataGridModule,
    DxFormModule,
    DxMenuModule,
    DxLoadPanelModule,
    DxAccordionModule,
    DxTabPanelModule,
    DxTextAreaModule,
    DxTextBoxModule,
    DxPopupModule,
    DxValidatorModule,
    DxValidationGroupModule,
    SideNavMenuModule,
    DxSelectBoxModule,
    DxToastModule,
    SideNavMenuModule,
    TopNavMenuModule,
    DxDateBoxModule,
    DxTooltipModule
  ],
  providers: [
    AppSettingsService,
    CommonService,
    EventConfigurationService,
    EventConfigurationDetailService,
    LoadPanelService,
    IngestionPlantMetricService,
    ToastService,
    WindowService,
    DatePipe,
    { provide: APP_INITIALIZER, useFactory: setSettings, deps: [AppSettingsService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory, deps: [AppSettingsService] },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory, deps: [AppSettingsService] },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    AuthGuardService,
    PermissionsService,
    PermissionGuardService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
