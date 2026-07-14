import * as fs from 'fs';
import { APIRequestContext, BrowserContext, request, test as base } from '@playwright/test';
import { authFilePath, realWorldProjectData } from '../../../playwright.config';
import { RealWorldPageManager } from '../ui/RealWorldPageManager';
import { ApiManager } from '../api/ApiManager';

// RealWorld Conduit stores the JWT in localStorage under this key.
const JWT_STORAGE_KEY = 'token';

type StorageState = {
    origins?: { localStorage?: { name: string; value: string }[] }[];
};

function extractToken(stateFilePath: string): string | null {
    const state: StorageState = JSON.parse(fs.readFileSync(stateFilePath, 'utf-8'));
    for (const origin of state.origins ?? []) {
        for (const item of origin.localStorage ?? []) {
            if (item.name === JWT_STORAGE_KEY) {
                return item.value;
            }
        }
    }
    return null;
}

type Fixtures = {
    createPageManagerAs: (userName: string | null) => Promise<RealWorldPageManager>;
    createApiManagerAs: (userName: string | null) => Promise<ApiManager>;
};

export const test = base.extend<Fixtures>({

    createPageManagerAs: async ({ browser }, use) => {
        const contexts: BrowserContext[] = [];

        await use(async (userName: string | null) => {
            const context = await browser.newContext({
                storageState: userName ? authFilePath(userName) : undefined,
            });
            contexts.push(context);
            const page = await context.newPage();
            await page.goto('/');
            return new RealWorldPageManager(page);
        });

        for (const context of contexts) {
            await context.close();
        }
    },

    createApiManagerAs: async ({}, use) => {
        const contexts: APIRequestContext[] = [];

        await use(async (userName: string | null) => {
            const token = userName ? extractToken(authFilePath(userName)) : null;

            const context = await request.newContext({
                baseURL: realWorldProjectData?.apiBaseUrl || 'http://localhost:8000/api',
            });
            contexts.push(context);
            return new ApiManager(context, token);
        });

        for (const context of contexts) {
            await context.dispose();
        }
    },

});