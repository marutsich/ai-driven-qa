import { test } from '@playwright/test';
import { authFilePath, realWorldProjectData } from '../../../playwright.config';
import { RealWorldPageManager } from '../ui/RealWorldPageManager';

if (!realWorldProjectData?.users?.length) {
    throw new Error('Project data is incomplete. Please set the REAL_WORLD_PROJECT_DATA environment variable with a users array.');
}

for (const user of realWorldProjectData.users) {
    test(`Login setup - ${user.name}`, async ({ browser }) => {

        const context = await browser.newContext();
        const page = await context.newPage();

        const realWorldPageManager = new RealWorldPageManager(page);

        await page.goto('/');
        await realWorldPageManager.navbar.SignIn.click();
        await realWorldPageManager.loginPage.login(user.username, user.password);

        // Wait for login to complete and localStorage to be written
        await realWorldPageManager.navbar.NewArticle.waitFor({ state: 'visible' });

        await context.storageState({ path: authFilePath(user.name) });
        await context.close();
    });
}