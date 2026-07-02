import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config();

type RealWorldProjectData = {
  baseUrl: string;
  username: string;
  password: string;
};

const realWorldProjectData: RealWorldProjectData = JSON.parse(process.env.PROJECT_DATA || '{}');

export default defineConfig({
  testDir: './src',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'realworld-setup',
      testMatch: '**/realworld/**/*.setup.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: realWorldProjectData?.baseUrl || 'https://demo.realworld.show/',
      }
    },
    {
      name: 'realworld',
      testMatch: '**/realworld/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: realWorldProjectData?.baseUrl || 'https://demo.realworld.show/',
        storageState: '.auth/realworld.json',
      },
      dependencies: ['realworld-setup'],
    },
  ],

});
