import { BasePage } from '../../base/base-page';

export class Login extends BasePage {

    Form = {
        Email: this.page.getByRole('textbox', { name: 'Email' }),
        Password: this.page.getByRole('textbox', { name: 'Password' }),
    }

     Buttons = {   
        SignIn: this.page.getByRole('button', { name: 'Sign in' }),
     }
}