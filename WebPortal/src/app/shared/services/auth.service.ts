import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private authService: MsalService) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        const accounts = this.authService.instance.getAllAccounts();
        const isAuthenticated: boolean = accounts && accounts.length > 0;

        if (!isAuthenticated) {
            localStorage.setItem("userRequestedRedirectUri", state.url);
        }
        return isAuthenticated;
    }
}