import { BasePage } from '../../base/base-page';

export class Navbar extends BasePage {

    SignIn = this.page.getByRole('link', { name: 'Sign in' });
    Home = this.page.getByRole('link', { name: 'Home' });
    SignUp = this.page.getByRole('link', { name: 'Sign up' });
    NewArticle = this.page.getByRole('link', { name: /New Article/i })

}