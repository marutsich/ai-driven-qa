import { test } from '../../base/base-test';
import { expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

test.describe('US-001. Publish Article', () => {
  let articleSlug: string | null = null;

  test('US001-TC-019. [E2E] Full happy-path journey — authenticated user publishes article visible in global feed @E2E', async ({
    createPageManagerAs,
    userInfo,
  }) => {
    await allure.epic('RealWorld');
    await allure.feature('Articles');
    await allure.story('Publish article');
    await allure.severity('critical');

    const user = userInfo();
    const pm = await createPageManagerAs();
    const title = `E2E Test Article ${Date.now()}`;

    await test.step('Step 1: Open the app as an authenticated user — navbar shows New Article', async () => {
      await expect(pm.navbar.NewArticle).toBeVisible();
    });

    await test.step('Step 2: Click New Article — editor page opens', async () => {
      await pm.navbar.NewArticle.click();
      await expect(pm.page).toHaveURL('/editor');
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
      await expect(pm.editorPage.descriptionInput).toHaveValue(
        'E2E description',
      );
      await expect(pm.editorPage.bodyInput).toHaveValue('E2E body content.');
    });

    await test.step('Step 4: Add tag "e2e" — chip appears, input clears', async () => {
      await pm.editorPage.addTag('e2e');
      await expect(
        pm.editorPage.tagChips.filter({ hasText: 'e2e' }),
      ).toBeVisible();
      await expect(pm.editorPage.tagInput).toHaveValue('');
    });

    await test.step('Step 5: Publish — navigate to article view; verify author, title, body, tag, Edit/Delete controls', async () => {
      const [publishResponse] = await Promise.all([
        pm.page.waitForResponse(
          (response) =>
            response.request().method() === 'POST' &&
            new URL(response.url()).pathname.endsWith('/articles'),
        ),
        pm.editorPage.publishButton.click(),
      ]);
      expect(publishResponse.status()).toBe(201);
      const { article } = await publishResponse.json();
      const slug = article?.slug;

      expect(
        slug,
        'Publish response should contain a non-empty article slug',
      ).toEqual(expect.stringMatching(/\S/));

      articleSlug = slug;

      await expect(pm.page).toHaveURL(`/article/${encodeURIComponent(slug)}`);
      await expect(pm.articleViewPage.heading).toHaveText(title);
      await expect(pm.articleViewPage.author).toHaveText(user.name);
      await expect(pm.articleViewPage.body).toHaveText('E2E body content.');
      await expect(
        pm.articleViewPage.tags.filter({ hasText: 'e2e' }),
      ).toBeVisible();
      await expect(pm.articleViewPage.editLink).toBeVisible();
      await expect(pm.articleViewPage.deleteButton).toBeVisible();
    });

    await test.step('Step 6: Navigate to home page — article appears in global feed', async () => {
      await pm.navbar.Home.click();
      await pm.homePage.globalFeedTab.click();
      await expect(pm.homePage.articleCardByTitle(title)).toBeVisible();
    });
  });

  test('US001-TC-A006. Create article with no auth token — 401 @Extended', async ({
    createApiManagerAs,
  }) => {
    const api = await createApiManagerAs(null);

    await test.step('POST /articles without Authorization header returns 401', async () => {
      const response = await api.articles.createArticle({
        title: 'TC-A006 Article',
        description: 'Description',
        body: 'Body text',
      });
      const status = response.status();
      const rawBody = await response.body();
      await test.info().attach(`API response (HTTP ${status})`, {
        body: rawBody,
        contentType: 'text/plain',
      });
      expect(status).toBe(401);
      const responseBody = JSON.parse(rawBody.toString('utf8'));
      expect(responseBody).toMatchObject({
        errors: { token: [expect.any(String)] },
      });
    });
  });

  test('US001-TC-A010. Title at exactly 100 characters is accepted — 201 @Extended', async ({
    createApiManagerAs,
  }) => {
    const api = await createApiManagerAs();
    const title = `TC-A010-${Date.now()}`.padEnd(100, 'x').slice(0, 100);

    await test.step('POST /articles with 100-char title returns 201', async () => {
      const response = await api.articles.createArticle({
        title,
        description: 'BVA boundary test',
        body: 'BVA boundary body',
      });
      const status = response.status();
      const rawBody = await response.body();
      await test.info().attach(`API response (HTTP ${status})`, {
        body: rawBody,
        contentType: 'text/plain',
      });
      expect(status).toBe(201);
      const responseBody = JSON.parse(rawBody.toString('utf8'));
      expect(responseBody?.article?.slug).toEqual(expect.stringMatching(/\S/));
      articleSlug = responseBody.article.slug;
      expect(responseBody).toMatchObject({
        article: {
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
          expect(responseBody.article.author[field]).toEqual(
            expect.any(String),
          );
        }
      }
    });
  });

  test.afterEach(async ({ createApiManagerAs }) => {
    const slug = articleSlug;
    articleSlug = null;

    if (slug === null) return;

    const api = await createApiManagerAs();
    const response = await api.articles.deleteArticle(slug);
    expect(response.status()).toBe(204);
  });
});
