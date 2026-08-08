import { Page } from '@playwright/test';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { EditorPage } from './pages/EditorPage';
import { ArticleViewPage } from './pages/ArticleViewPage';
import { HomePage } from './pages/HomePage';

export class RealWorldPageManager {
    private readonly _page: Page;
    private _navbar?: Navbar;
    private _loginPage?: LoginPage;
    private _editorPage?: EditorPage;
    private _articleViewPage?: ArticleViewPage;
    private _homePage?: HomePage;

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

    get editorPage(): EditorPage {
        return this._editorPage ??= new EditorPage(this._page);
    }

    get articleViewPage(): ArticleViewPage {
        return this._articleViewPage ??= new ArticleViewPage(this._page);
    }

    get homePage(): HomePage {
        return this._homePage ??= new HomePage(this._page);
    }
}