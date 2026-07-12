import { APIRequestContext } from '@playwright/test';

export abstract class BaseApiClient {
    protected readonly request: APIRequestContext;
    protected readonly token: string | null;

    constructor(request: APIRequestContext, token: string | null = null) {
        this.request = request;
        this.token = token;
    }

    protected authHeaders(): Record<string, string> {
        return this.token ? { Authorization: `Token ${this.token}` } : {};
    }
}
