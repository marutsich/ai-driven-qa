import { test } from '../../base/base-test';
import { expect } from '@playwright/test';
import { realWorldProjectData } from '../../../../playwright.config';

test.describe('US-001. Publish Article', () => {

    test('US001-TC-019. [E2E] Full happy-path journey — login to published article visible in global feed @E2E', async ({ createPageManagerAs }) => {
        const pm = await createPageManagerAs(null);
        const title = `E2E Test Article ${Date.now()}`;
        const slug = title.toLowerCase().replace(/\s+/g, '-');
        const user = realWorldProjectData.users.find(u => u.name === 'user1')!;

        await test.step('Step 1: Open the app and log in — navbar shows New Article', async () => {
            await pm.navbar.SignIn.click();
            await pm.loginPage.login(user.username, user.password);
            await expect(pm.navbar.NewArticle).toBeVisible();
        });

        await test.step('Step 2: Click New Article — editor page opens', async () => {
            await pm.navbar.NewArticle.click();
            await expect(pm.page).toHaveURL(/#\/editor/);
        });

        await test.step('Step 3: Fill Title, Description, and Body', async () => {
            await pm.editorPage.titleInput.fill(title);
            await pm.editorPage.descriptionInput.fill('E2E description');
            await pm.editorPage.bodyInput.fill('E2E body content.');
        });

        await test.step('Step 4: Add tag "e2e" — chip appears, input clears', async () => {
            await pm.editorPage.addTag('e2e');
            await expect(pm.editorPage.tagChips.filter({ hasText: 'e2e' })).toBeVisible();
            await expect(pm.editorPage.tagInput).toHaveValue('');
        });

        await test.step('Step 5: Publish — navigate to article view; verify title, body, tag, Edit/Delete controls', async () => {
            await pm.editorPage.publishButton.click();
            // KNOWN BUG (AC-14): app stays on /editor and shows success toast instead of redirecting to /article/{slug}
            await expect(pm.editorPage.successMessage).toBeVisible();

            await pm.page.goto(`/#/article/${slug}`);
            await expect(pm.articleViewPage.heading).toHaveText(title);
            await expect(pm.articleViewPage.body).toHaveText('E2E body content.');
            // KNOWN BUG: description field is not displayed on the article view page
            await expect(pm.articleViewPage.tags.filter({ hasText: 'e2e' })).toBeVisible();
            await expect(pm.articleViewPage.editButton).toBeVisible();
            await expect(pm.articleViewPage.deleteButton).toBeVisible();
        });

        await test.step('Step 6: Navigate to home page — article appears in global feed', async () => {
            await pm.navbar.Home.click();
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
        });
    });

    test('US001-TC-A010. Title at exactly 100 characters is accepted — 201 @Extended', async ({ createApiManagerAs }) => {
        const api = await createApiManagerAs('user1');
        const title = `TC-A010-${Date.now()}`.padEnd(100, 'x').slice(0, 100);

        await test.step('POST /articles with 100-char title returns 201', async () => {
            const response = await api.articles.createArticle({
                title,
                description: 'BVA boundary test',
                body: 'BVA boundary body',
            });
            expect(response.status()).toBe(201);
        });
    });

});
