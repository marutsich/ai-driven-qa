import { test } from '../../base/base-test';
import { expect } from '@playwright/test';
import { realWorldProjectData } from '../../../../playwright.config';

test.describe('US-001. Publish Article', () => {
    const publishingUser = realWorldProjectData.users[0];
    if (!publishingUser) {
        throw new Error('Project data is incomplete. Please set the REAL_WORLD_PROJECT_DATA environment variable with a users array.');
    }

    test('US001-TC-019. [E2E] Full happy-path journey — login to published article visible in global feed @E2E', async ({ createPageManagerAs }) => {
        const pm = await createPageManagerAs(null);
        const title = `E2E Test Article ${Date.now()}`;

        await test.step('Step 1: Open the app and log in — navbar shows New Article', async () => {
            await pm.navbar.SignIn.click();
            await pm.loginPage.login(publishingUser.username, publishingUser.password);
            await expect(pm.navbar.NewArticle).toBeVisible();
        });

        await test.step('Step 2: Click New Article — editor page opens', async () => {
            await pm.navbar.NewArticle.click();
            await expect(pm.editorPage.titleInput).toBeVisible();
            await expect(pm.editorPage.descriptionInput).toBeVisible();
            await expect(pm.editorPage.bodyInput).toBeVisible();
            await expect(pm.editorPage.tagInput).toBeVisible();
            await expect(pm.editorPage.publishButton).toBeVisible();
        });

        await test.step('Step 3: Fill Title, Description, and Body', async () => {
            await pm.editorPage.titleInput.fill(title);
            await pm.editorPage.descriptionInput.fill('E2E description');
            await pm.editorPage.bodyInput.fill('E2E body content.');
            await expect(pm.editorPage.titleInput).toHaveValue(title);
            await expect(pm.editorPage.descriptionInput).toHaveValue('E2E description');
            await expect(pm.editorPage.bodyInput).toHaveValue('E2E body content.');
        });

        await test.step('Step 4: Add tag "e2e" — chip appears, input clears', async () => {
            await pm.editorPage.addTag('e2e');
            await expect(pm.editorPage.tagChips.filter({ hasText: 'e2e' })).toBeVisible();
            await expect(pm.editorPage.tagInput).toHaveValue('');
        });

        await test.step('Step 5: Publish — navigate to article view; verify title, body, tag, Edit/Delete controls', async () => {
            await pm.editorPage.publishButton.click();
            await expect(pm.articleViewPage.heading).toHaveText(title);
            await expect(pm.articleViewPage.body).toHaveText('E2E body content.');
            await expect(pm.articleViewPage.tags.filter({ hasText: 'e2e' })).toBeVisible();
            await expect(pm.articleViewPage.editLink).toBeVisible();
            await expect(pm.articleViewPage.deleteButton).toBeVisible();
        });

        await test.step('Step 6: Navigate to home page — article appears in global feed', async () => {
            await pm.navbar.Home.click();
            await pm.homePage.globalFeedTab.click();
            await expect(pm.homePage.articleCardByTitle(title)).toBeVisible();
        });
    });

    test('US001-TC-A006. Create article with no auth token — 401 @Extended', async ({ createApiManagerAs }) => {
        const api = await createApiManagerAs(null);

        await test.step('POST /articles without Authorization header returns 401', async () => {
            const response = await api.articles.createArticle({
                title: 'TC-A006 Article',
                description: 'Description',
                body: 'Body text',
            });
            expect(response.status()).toBe(401);
            const responseBody = await response.json();
            expect(responseBody).toMatchObject({
                errors: { token: [expect.any(String)] },
            });
        });
    });

    test('US001-TC-A010. Title at exactly 100 characters is accepted — 201 @Extended', async ({ createApiManagerAs }) => {
        const api = await createApiManagerAs(publishingUser.name);
        const title = `TC-A010-${Date.now()}`.padEnd(100, 'x').slice(0, 100);

        await test.step('POST /articles with 100-char title returns 201', async () => {
            const response = await api.articles.createArticle({
                title,
                description: 'BVA boundary test',
                body: 'BVA boundary body',
            });
            expect(response.status()).toBe(201);
            const responseBody = await response.json();
            expect(responseBody).toMatchObject({
                article: {
                    slug: expect.any(String),
                    title,
                    description: 'BVA boundary test',
                    body: 'BVA boundary body',
                    tagList: [],
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    favorited: false,
                    favoritesCount: 0,
                    author: {
                        username: expect.any(String),
                        following: false,
                    },
                },
            });
            for (const field of ['bio', 'image']) {
                expect(responseBody.article.author).toHaveProperty(field);
                if (responseBody.article.author[field] !== null) {
                    expect(responseBody.article.author[field]).toEqual(expect.any(String));
                }
            }
        });
    });

});
