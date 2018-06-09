import { Injectable } from '@angular/core';
//import 'expose-loader?AuthenticationContext!../node_modules/adal-angular/lib/adal.js';
import * as AuthenticationContext from "adal-angular";

import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

import { EZCodeAdalConfigs } from './ezcode-adalconfig.service';
import { IEZLoginUser } from './IEZLoginUser';
import { IEZCodeAdalConfig } from '.';

@Injectable()
export class EZCodeAdalService {

  private context: AuthenticationContext;
  private CACHE_DELIMETER: string = '||';
  private tenantKey: string = 'tenant';

  constructor(private configs: EZCodeAdalConfigs, private tenant: string) {
    this.saveItem(this.tenantKey, tenant, true);
    this.context = new AuthenticationContext(this.getConfigTenantBased(this.tenantKey));
  }
  public set adalConfig(tenant: string) {
    this.saveItem(this.tenantKey, tenant, true);
    this.context.config = this.getConfigTenantBased(this.tenantKey);
  }

  getConfigTenantBased(tenantKey: string) : IEZCodeAdalConfig {
    let tenant = this.getItem(tenantKey);
    for (var i = 0; i < this.configs.adalconfigs.length; i++) {
      if (tenant === this.configs.adalconfigs[i].tenant) {
        return this.configs.adalconfigs[i];
      }
    }
  }
  login() {
    this.context.login();
  }

  logout() {
    this.context.logOut();
  }

  handleCallback() {
    this.context.handleWindowCallback();
  }

  public get userInfo(): IEZLoginUser {
    const adalUser = this.context.getCachedUser();
    return adalUser == null ? null :
      {
        upn: adalUser.userName,
        firstName: adalUser.profile["given_name"],
        lastName: adalUser.profile["family_name"],
        displayName: adalUser.profile["name"],
        profile: adalUser.profile
      };
  }

  public get accessToken() {
    return this.context.getCachedToken(this.getConfigTenantBased(this.tenantKey).clientId);
  }
  public getAccessTokenByUrl(url: string): Observable<string> {
    return Observable.create(emitter => {
      const resourceId = this.context.getResourceForEndpoint(url);
      if (resourceId != null) {
        this.context.acquireToken(resourceId,
          (message, token) => {
            emitter.next(token);
            emitter.complete();
          });
      } else {
        emitter.next(null);
        emitter.complete();
      }
    });
  }
  public get isAuthenticated() {
    return this.userInfo && this.accessToken;
  }
  public acquireTokenPopup(
    resource: string,
    extraQueryParameters: string | null | undefined,
    claims: string | null | undefined,
    callback: AuthenticationContext.TokenCallback
  ): void {
    this.context.acquireTokenPopup(resource, extraQueryParameters, claims, callback);
  }
  /**
   * Acquires token (interactive flow using a redirect) by sending request to AAD to obtain a new token. In this case the callback passed in the authentication request constructor will be called.
   * @param resource Resource URI identifying the target resource.
   * @param extraQueryParameters Query parameters to add to the authentication request.
   * @param claims Claims to add to the authentication request.
   */
  public acquireTokenRedirect(
    resource: string,
    extraQueryParameters?: string | null,
    claims?: string | null
  ): void {
    this.context.acquireTokenRedirect(resource, extraQueryParameters, claims);
  }


  /**
   * Saves the key-value pair in the cache
   * @ignore
   */
  public saveItem(key: string, obj: any, preserve: any) {

    // Default as session storage
    if (!this.supportsSessionStorage()) {
      console.log('Session storage is not supported');
      if (!this.supportsLocalStorage()) {
        console.log('Local storage is not supported');
      } else if (preserve) {
        var value = this.getItem(key) || '';
        localStorage.setItem(key, value + obj + this.CACHE_DELIMETER);
      } else {
        localStorage.setItem(key, obj);
      }
    } else {
      sessionStorage.setItem(key, obj);
    }
  }

  /**
   * Searches the value for the given key in the cache
   * @ignore
   */
  public getItem(key: string): string {
    // Default as session storage
    if (!this.supportsSessionStorage()) {
      console.log('Session storage is not supported');
      if (!this.supportsLocalStorage()) {
        console.log('Local storage is not supported');
      } else {
        return localStorage.getItem(key);
      }
    } else {
      return sessionStorage.getItem(key);
    }
  }

  /**
   * Returns true if browser supports localStorage, false otherwise.
   * @ignore
   */
  private supportsLocalStorage(): boolean {
    try {
      if (!window.localStorage) return false; // Test availability
      window.localStorage.setItem('storageTest', 'A'); // Try write
      if (window.localStorage.getItem('storageTest') != 'A') return false; // Test read/write
      window.localStorage.removeItem('storageTest'); // Try delete
      if (window.localStorage.getItem('storageTest')) return false; // Test delete
      return true; // Success
    } catch (e) {
      return false;
    }
  }

  /**
   * Returns true if browser supports sessionStorage, false otherwise.
   * @ignore
   */
  private supportsSessionStorage(): boolean {
    try {
      if (!window.sessionStorage) return false; // Test availability
      window.sessionStorage.setItem('storageTest', 'A'); // Try write
      if (window.sessionStorage.getItem('storageTest') != 'A') return false; // Test read/write
      window.sessionStorage.removeItem('storageTest'); // Try delete
      if (window.sessionStorage.getItem('storageTest')) return false; // Test delete
      return true; // Success
    } catch (e) {
      return false;
    }
  }
}
