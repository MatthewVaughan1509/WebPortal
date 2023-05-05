import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { from } from 'rxjs'
import { AppLocalStorage } from '../utils/app-local-storage';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.handle(req, next))
    }

    async handle(req: HttpRequest<any>, next: HttpHandler) {
        await this.authService.getCurrentSessionAsync();
        const userToken = AppLocalStorage.getAccessToken();
        const modifiedReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${userToken}`),
        });
        return next.handle(modifiedReq).toPromise();
    }
}