
export interface IEZCodeAdalConfig{
    tenant: string;
    clientId: string;
    redirectUri: string;
    postLogoutRedirectUri: string;
    cacheLocation?: "localStorage" | "sessionStorage";
    endpoints: any;
}