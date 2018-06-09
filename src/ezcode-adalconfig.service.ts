import { Injectable } from '@angular/core';
import { IEZCodeAdalConfig } from './IEZCodeAdalConfig';
import { IEZCodeAdalConfigs } from './IEZCodeAdalConfigs';
import { inject } from '@angular/core/testing';

@Injectable()
export class EZCodeAdalConfigs implements IEZCodeAdalConfigs {
  adalconfigs: IEZCodeAdalConfig[];
  //[{
  //  tenant: string;
  //  tenantId: string;
  //  clientId: string;
  //  redirectUri: string;
  //  extraQueryParameter: string;
  //  postLogoutRedirectUri: string;
  //  cacheLocation?: "localStorage" | "sessionStorage";
  //  endpoints: any;
  //}];
  customRedirectAfterLogin: string;
}
