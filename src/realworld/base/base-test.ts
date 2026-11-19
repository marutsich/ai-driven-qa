import * as fs from 'fs';
import {
  APIRequestContext,
  BrowserContext,
  request,
  test as base,
} from '@playwright/test';
import { authFilePath, getRealWorldProjectData } from '../config';
import { RealWorldPageManager } from '../ui/RealWorldPageManager';
import { ApiManager } from '../api/ApiManager';

// RealWorld Conduit stores the JWT in localStorage under this key.
const JWT_STORAGE_KEY = 'jwtToken';

type StorageState = {
  origins?: {
    origin: string;
    localStorage?: { name: string; value: string }[];
  }[];
};

function extractToken(stateFilePath: string, expectedOrigin: string): string {
  const state: StorageState = JSON.parse(
    fs.readFileSync(stateFilePath, 'utf-8'),
  );
  for (const origin of state.origins ?? []) {
    if (origin.origin !== expectedOrigin) continue;
    for (const item of origin.localStorage ?? []) {
      if (item.name === JWT_STORAGE_KEY && item.value.trim()) {
        return item.value;
      }
    }
  }
  throw new Error(
    `No non-empty JWT found in storage state file: ${stateFilePath}`,
  );
}

function selectUser(
  userIndex: number | null | undefined,
  users: ReturnType<typeof getRealWorldProjectData>['users'],
  parallelIndex: number,
): (typeof users)[number] | null {
  if (userIndex === null) {
    return null;
  }

  const index =
    userIndex === undefined ? parallelIndex % users.length : userIndex;
  if (!Number.isInteger(index) || index < 0 || index >= users.length) {
    throw new RangeError(
      `Invalid user index ${index}. Expected an integer between 0 and ${users.length - 1}.`,
    );
  }

  return users[index];
}

type Fixtures = {
  userInfo: (userIndex?: number) => { name: string; email: string };
  createPageManagerAs: (
    userIndex?: number | null,
  ) => Promise<RealWorldPageManager>;
  createApiManagerAs: (userIndex?: number | null) => Promise<ApiManager>;
};

export const test = base.extend<Fixtures>({
  userInfo: async ({}, use, testInfo) => {
    const { users } = getRealWorldProjectData();

    await use((userIndex) => {
      const user = selectUser(userIndex, users, testInfo.parallelIndex);
      if (user === null) throw new TypeError('userInfo requires a user');
      return { name: user.name, email: user.username };
    });
  },

  createPageManagerAs: async ({ browser }, use, testInfo) => {
    const { baseUrl, users } = getRealWorldProjectData();
    const contexts: BrowserContext[] = [];

    await use(async (userIndex?: number | null) => {
      const user = selectUser(userIndex, users, testInfo.parallelIndex);
      const context = await browser.newContext({
        baseURL: baseUrl,
        storageState: user ? authFilePath(user.name) : undefined,
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

  createApiManagerAs: async ({}, use, testInfo) => {
    const { apiBaseUrl, baseUrl, users } = getRealWorldProjectData();
    const contexts: APIRequestContext[] = [];

    await use(async (userIndex?: number | null) => {
      const user = selectUser(userIndex, users, testInfo.parallelIndex);
      const token = user
        ? extractToken(authFilePath(user.name), new URL(baseUrl).origin)
        : null;

      const context = await request.newContext({
        baseURL: apiBaseUrl,
      });
      contexts.push(context);
      return new ApiManager(context, token);
    });

    for (const context of contexts) {
      await context.dispose();
    }
  },
});
