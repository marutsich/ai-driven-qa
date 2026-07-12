import { Page } from '@playwright/test';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';

export class RealWorldPageManager {
    private readonly _page: Page;
    private _navbar?: Navbar;
    private _loginPage?: LoginPage;

    constructor(page: Page) {
        this._page = page;
    }

    get page(): Page {
        return this._page;
    }

    get navbar(): Navbar {
        return this._navbar ??= new Navbar(this._page);
    }

    get loginPage(): LoginPage {
        return this._loginPage ??= new LoginPage(this._page);
    }
}