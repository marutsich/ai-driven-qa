import { APIRequestContext } from '@playwright/test';
import { UserApiClient } from './clients/UserApiClient';

export class ApiManager {
    private readonly _request: APIRequestContext;
    private readonly _token: string | null;

    private _user?: UserApiClient;

    constructor(request: APIRequestContext, token: string | null = null) {
        this._request = request;
        this._token = token;
    }

    get user(): UserApiClient {
        return this._user ??= new UserApiClient(this._request, this._token);
    }
}
