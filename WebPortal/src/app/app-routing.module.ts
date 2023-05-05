import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AuthGuardService } from './shared/services/auth.service';
import { PermissionGuardService } from './shared/services/permission-guard.service';
import { EventConfigurationComponent } from './pages/event-configuration/event-configuration.component';
import { EventConfigurationDetailComponent } from './pages/event-configuration-detail/event-configuration-detail.component';
import { HomeComponent } from './pages/home/home.component';
import { IngestionPlantMetricComponent } from './pages/ingestion-plant-metric/ingestion-plant-metric.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { RouteUrl } from './entities/routeUrl';

const routes: Routes = [
  {
    // Needed for hash routing
    path: 'error',
    component: HomeComponent
  },
  {
    // Needed for hash routing
    path: 'state',
    component: HomeComponent
  },
  {
    // Needed for hash routing
    path: 'code',
    component: HomeComponent
  },
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: RouteUrl.EventConfiguration, component: EventConfigurationComponent, canActivate: [MsalGuard, AuthGuardService, PermissionGuardService], data: { url: RouteUrl.EventConfiguration }  },
  { path: RouteUrl.EventConfigurationDetail, component: EventConfigurationDetailComponent, canActivate: [MsalGuard, AuthGuardService, PermissionGuardService], data: { url: RouteUrl.EventConfigurationDetail }  },
  { path: RouteUrl.IngestionPlantMetric, component: IngestionPlantMetricComponent, canActivate: [MsalGuard, AuthGuardService, PermissionGuardService], data: { url: RouteUrl.IngestionPlantMetric } },
  { path: RouteUrl.Unauthorized, component: UnauthorizedComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
