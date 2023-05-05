import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PermissionsService } from './permissions.service';
import { Actions } from '../../entities/actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouteUrl } from 'src/app/entities/routeUrl';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuardService implements CanActivate {

  constructor(private permissionsService: PermissionsService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkPermission(route.data['url']);
  }

  checkPermission(routeUrl: string) {
    // first check from existing permissions collection
    let permission: any = this.permissionsService.getPermissionForActionsByRoute(routeUrl);
    if (permission) {
      let canActivateRoute: boolean = permission.PageActions.some(x => x.Name == Actions.View && x.HasAccess);
      if (!canActivateRoute) this.router.navigate([RouteUrl.Unauthorized]);
      return canActivateRoute;
    }
    // permission doesn't exist in collection, make api call and add it to a collection
    return this.permissionsService.getPermissionForPage(routeUrl).pipe(map((data) => {
      let canActivateRoute: boolean = false;
      if (data) {
        this.permissionsService.permissions.push(data);
        canActivateRoute = data.PageActions.some(x => x.Name == Actions.View && x.HasAccess);
      }
      if (!canActivateRoute) this.router.navigate([RouteUrl.Unauthorized]);
      return canActivateRoute;
    }));
  }

}
