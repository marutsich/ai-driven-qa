import { test as base } from '@playwright/test';
import { RealWorldPageManager } from '../ui/RealWorldPageManager';


type Fixtures = {
    realWorldPageManager: RealWorldPageManager;
}

export const test = base.extend<Fixtures>({

});