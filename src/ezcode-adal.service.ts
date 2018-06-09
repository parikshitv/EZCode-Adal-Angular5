import { Injectable } from '@angular/core';
//import 'expose-loader?AuthenticationContext!../node_modules/adal-angular/lib/adal.js';
import * as AuthenticationContext from "adal-angular";

import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

import {EZCodeAdalConfig} from './ezcode-adalconfig.service';
import { IEZLoginUser } from './IEZLoginUser';

@Injectable()
export class EZCodeAdalService {

    private context: AuthenticationContext;
    constructor(private config: EZCodeAdalConfig) {
        this.context =  new AuthenticationContext(config);
    }
    public set adalConfig(config: EZCodeAdalConfig){
        this.context.config=config;
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
        return this.context.getCachedToken(this.config.clientId);
    }
    public getAccessTokenByUrl(url: string): Observable<string>{
        return Observable.create(emitter=>{
            const resourceId = this.context.getResourceForEndpoint(url);
            if(resourceId!=null){
                this.context.acquireToken(resourceId, 
                    (message, token)=>{
                        emitter.next(token);
                        emitter.complete();
                    });
            }else{
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
    ): void{
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
    ): void{
        this.context.acquireTokenRedirect(resource, extraQueryParameters, claims);
    }
}