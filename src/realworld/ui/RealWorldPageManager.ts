import { Page } from '@playwright/test';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';

export class RealWorldPageManager {
    private readonly _page: Page;
    private _navbar?: Navbar;
    private _login?: Login;

    constructor(page: Page) {
        this._page = page;
    }

    get page(): Page {
        return this._page;
    }

    get navbar(): Navbar {
        return this._navbar ??= new Navbar(this._page);
    }

    get login(): Login {
        return this._login ??= new Login(this._page);
    }
}