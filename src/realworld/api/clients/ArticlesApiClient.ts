import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../../base/base-api-client';

type NewArticlePayload = {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
};

export class ArticlesApiClient extends BaseApiClient {
    constructor(request: APIRequestContext, token: string | null = null) {
        super(request, token);
    }

    createArticle(payload: NewArticlePayload) {
        const body = { article: { tagList: [], ...payload } };
        return this.request.post('articles', { data: body, headers: this.authHeaders() });
    }
}
