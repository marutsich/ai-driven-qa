import { BasePage } from '../../base/base-page';

export class EditorPage extends BasePage {

    titleInput = this.page.getByPlaceholder('Article Title');
    descriptionInput = this.page.getByPlaceholder("What's this article about?");
    bodyInput = this.page.getByPlaceholder('Write your article (in markdown)');
    tagInput = this.page.getByPlaceholder('Enter tags');
    publishButton = this.page.getByRole('button', { name: 'Publish Article' });
    successMessage = this.page.getByText('Published successfully!');
    tagChips = this.page.locator('span.tag-default.tag-pill');

    async addTag(tag: string): Promise<void> {
        await this.tagInput.fill(tag);
        await this.tagInput.press('Enter');
    }

}
