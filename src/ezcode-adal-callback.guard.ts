import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from '@angular/router';
import { EZCodeAdalService } from './ezcode-adal.service';
import { EZCodeAdalConfigs } from './ezcode-adalconfig.service';

@Injectable()
export class EZCodeAdalCallbackGuard implements CanActivate {
  constructor(private router: Router, private adalService: EZCodeAdalService, private configs: EZCodeAdalConfigs) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        this.adalService.handleCallback();
      var customLoginRedirect: string = this.configs.customRedirectAfterLogin;
      if (this.adalService.userInfo) {
        if (customLoginRedirect) {
          this.router.navigate([customLoginRedirect]);
        } else {
          this.router.navigate(['']);
        }
            //this.router.navigate(['']);
            // var returnUrl = route.queryParams['returnUrl'];
            // if (!returnUrl) {
            //     this.router.navigate(['']);
            // } else {
            //     this.router.navigate([returnUrl], { queryParams: route.queryParams });
            // }
        }
        return false;
    }
}
