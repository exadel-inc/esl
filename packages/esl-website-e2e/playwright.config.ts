import {defineConfig, devices} from 'playwright/test';

const isCI = Boolean(process.env.CI);
const PORT = Number(process.env.PORT ?? 3007);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  fullyParallel: true,
  retries: isCI ? 1 : 0,
  reporter: [['list'], ['html', {open: 'never'}]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: {
      args: [
        '--disable-font-subpixel-positioning',
        '--disable-lcd-text',
        '--font-render-hinting=none',
      ]
    },
    deviceScaleFactor: 1
  },
  updateSnapshots: isCI ? 'none' : 'missing',

  // Auto-start website for e2e runs (can be reused if already running).
  webServer: {
    command: 'npx nx run esl-website:start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: {
      ...process.env,
      PORT: String(PORT),
      SITE_ENV: 'e2e'
    }
  },

  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 5']
      }
    }
  ]
});
