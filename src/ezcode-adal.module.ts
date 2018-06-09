import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { IdTokenCallbackComponent } from './idtoken-callback.component';
import { AccesstokenCallbackComponent } from './accesstoken-callback.component';
import { EZCodeHttpInterceptor } from './ezcode-http.interceptor';
import { IEZCodeAdalConfig } from './IEZCodeAdalConfig';
import { EZCodeAdalService } from './ezcode-adal.service';
import { EZCodeAdalConfigs } from './ezcode-adalconfig.service';
import { EZCodeAdalComponentGuard } from './ezcode-adal-component.guard';
import { EZCodeAdalCallbackGuard } from './ezcode-adal-callback.guard';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'id_token', component: IdTokenCallbackComponent, canActivate: [EZCodeAdalCallbackGuard] }, //, canActivate: [EZCodeAdalGuard]
            { path: 'access_token', component: AccesstokenCallbackComponent, canActivate: [EZCodeAdalCallbackGuard]} //, canActivate: [EZCodeAdalGuard] 
        ])
    ],
    declarations: [
        IdTokenCallbackComponent,
        AccesstokenCallbackComponent
    ],
    providers: [
        [
            { provide: HTTP_INTERCEPTORS, useClass: EZCodeHttpInterceptor, multi: true },
        ],
        EZCodeAdalComponentGuard,
        EZCodeAdalCallbackGuard,
        EZCodeAdalConfigs,
        EZCodeAdalService
    ]
})
export class EZCodeAdalModule {
    constructor (@Optional() @SkipSelf() parentModule: EZCodeAdalModule) {
        if (parentModule) {
          throw new Error(
            'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
    static forRoot(config: EZCodeAdalConfigs): ModuleWithProviders {
        return {
          ngModule: EZCodeAdalModule,
          providers: [
            {provide: EZCodeAdalConfigs, useValue: config }
          ]
        };
      }
        
 }
