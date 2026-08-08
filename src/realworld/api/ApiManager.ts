import { APIRequestContext } from '@playwright/test';
import { UserApiClient } from './clients/UserApiClient';
import { ArticlesApiClient } from './clients/ArticlesApiClient';

export class ApiManager {
    private readonly _request: APIRequestContext;
    private readonly _token: string | null;

    private _user?: UserApiClient;
    private _articles?: ArticlesApiClient;

    constructor(request: APIRequestContext, token: string | null = null) {
        this._request = request;
        this._token = token;
    }

    get user(): UserApiClient {
        return this._user ??= new UserApiClient(this._request, this._token);
    }

    get articles(): ArticlesApiClient {
        return this._articles ??= new ArticlesApiClient(this._request, this._token);
    }
}
