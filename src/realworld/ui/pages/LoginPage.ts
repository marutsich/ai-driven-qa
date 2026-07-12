import { BasePage } from '../../base/base-page';

export class LoginPage extends BasePage {

    Form = {
        Email: this.page.getByRole('textbox', { name: 'Email' }),
        Password: this.page.getByRole('textbox', { name: 'Password' }),
    }

     Buttons = {   
        SignIn: this.page.getByRole('button', { name: 'Sign in' }),
     }

     async login(email: string, password: string) {
        await this.Form.Email.fill(email);
        await this.Form.Password.fill(password);
        await this.Buttons.SignIn.click();
     }
}