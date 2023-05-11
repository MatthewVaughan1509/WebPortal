import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { RouteUrl } from './entities/routeUrl';
import { DemoPageComponent } from './pages/demo-page/demo-page.component';
import { PageDetailsComponent } from './pages/page-details/page-details.component';

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
  { path: '', component: DemoPageComponent },
  { path: 'home', component: DemoPageComponent },
  { path: RouteUrl.Unauthorized, component: UnauthorizedComponent },
  { path: RouteUrl.DemoRoute, component: DemoPageComponent },
  { path: RouteUrl.DemoDetails, component: PageDetailsComponent },
  { path: `${RouteUrl.DemoDetails}/:pageid`, component: PageDetailsComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
