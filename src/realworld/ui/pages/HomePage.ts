import { BasePage } from '../../base/base-page';

export class HomePage extends BasePage {

    globalFeedTab = this.page.getByText('Global Feed');
    articlePreviews = this.page.locator('.article-preview');

    articleCardByTitle(title: string) {
        return this.page.locator('.article-preview').filter({ hasText: title });
    }

}
