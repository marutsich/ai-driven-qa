import { BasePage } from '../../base/base-page';

export class RegisterPage extends BasePage {
    Form = {
        Username: this.page.getByRole('textbox', { name: 'Username', exact: true }),
        Email: this.page.getByRole('textbox', { name: 'Email', exact: true }),
        Password: this.page.getByRole('textbox', { name: 'Password', exact: true }),
    };

    Buttons = {
        SignUp: this.page.getByRole('button', { name: 'Sign up', exact: true }),
    };

    async register(username: string, email: string, password: string) {
        await this.Form.Username.fill(username);
        await this.Form.Email.fill(email);
        await this.Form.Password.fill(password);
        await this.Buttons.SignUp.click();
    }
}
