import { Injectable } from '@angular/core';
import {IEZCodeAdalConfig} from './IEZCodeAdalConfig'
import { inject } from '@angular/core/testing';

@Injectable()
export class EZCodeAdalConfig implements IEZCodeAdalConfig
{
    tenant: string;
    clientId: string;
    redirectUri: string;
    postLogoutRedirectUri: string;
    cacheLocation?: "localStorage" | "sessionStorage";
    endpoints: any;
}