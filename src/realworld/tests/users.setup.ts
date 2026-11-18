import { expect } from '@playwright/test';
import { test } from '../base/base-test';
import { authFilePath, getRealWorldProjectData } from '../config';

const { users } = getRealWorldProjectData();

for (const user of users) {
  test(`Registration setup - ${user.name}`, async ({ createPageManagerAs }) => {
    const pm = await createPageManagerAs(null);

    await test.step('Open Sign up and register the configured user', async () => {
      await pm.navbar.SignUp.click();
      // The existing config stores the email in username; name identifies the user.
      await pm.registerPage.register(user.name, user.username, user.password);
      await expect(pm.navbar.NewArticle).toBeVisible();
    });

    await test.step('Save authenticated storage state', async () => {
      await pm.page.context().storageState({ path: authFilePath(user.name) });
    });
  });
}
