import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxAccordionModule, DxBoxModule, DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxFormModule, DxLoadPanelModule, DxMenuModule, DxTabPanelModule, DxTextAreaModule, DxTextBoxModule, DxPopupModule, DxSelectBoxModule, DxToastModule, DxTooltipModule, DxValidatorModule, DxValidationGroupModule, DxDateBoxModule, DxHtmlEditorModule } from 'devextreme-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppSettingsService } from './shared/services/app-settings.service';
import { HomeComponent } from './pages/home/home.component';
import { ErrorNotificationComponent } from './shared/components/error-notification/error-notification.component';
import { WindowService } from './shared/services/window.service';
import { SideNavMenuModule } from '@ppm/side-nav-menu';
import { LoadPanelComponent } from './shared/components/load-panel/load-panel.component';
import { LoadPanelService } from './shared/components/load-panel/load-panel.service';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ToastService } from './shared/components/toast/toast.service';
import { TopNavMenuModule } from '@ppm/top-nav-menu';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { DemoPageComponent } from './pages/demo-page/demo-page.component';
import { PageDetailsComponent } from './pages/page-details/page-details.component';

export function setSettings(configService: AppSettingsService) {
  return () => configService.setSettings();
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorNotificationComponent,
    LoadPanelComponent,
    ToastComponent,
    UnauthorizedComponent,
    DemoPageComponent,
    PageDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
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
    DxTooltipModule,
    DxHtmlEditorModule
  ],
  providers: [
    AppSettingsService,
    LoadPanelService,
    ToastService,
    WindowService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
