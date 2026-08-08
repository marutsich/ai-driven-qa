import { BasePage } from '../../base/base-page';

export class ArticleViewPage extends BasePage {

    heading = this.page.getByRole('heading', { level: 1 });
    body = this.page.locator('.article-content p');
    tags = this.page.locator('.article-content .tag-list li.tag-default.tag-pill.tag-outline');
    editButton = this.page.getByRole('button', { name: /Edit Article/i }).first();
    deleteButton = this.page.getByRole('button', { name: /Delete Article/i }).first();

}
