import {defineConfig, devices} from 'playwright/test';

const isCI = Boolean(process.env.CI);
const isDebug = Boolean(process.env.E2E_DEBUG);
const PORT = Number(process.env.PORT ?? 3007);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests',
  timeout: 180_000,
  expect: {
    timeout: 60_000
  },
  fullyParallel: true,
  retries: isCI ? 1 : 0,
  reporter: [['list'], ['html', {open: 'never'}]],
  use: {
    baseURL,
    trace: isCI ? (isDebug ? 'retain-on-failure' : 'off'): 'on',
    video: isCI ? 'retain-on-failure' : 'on',
    screenshot: 'on',
    launchOptions: {
      args: [
        '--disable-font-subpixel-positioning',
        '--disable-lcd-text',
        '--disable-gpu',
        '--disable-features=LayoutNG',
        '--force-device-scale-factor=1',
        '--font-render-hinting=none',
      ]
    },
    deviceScaleFactor: 1
  },
  updateSnapshots: isCI ? 'none' : 'missing',

  // Auto-start website for e2e runs (can be reused if already running).
  webServer: {
    command: 'npx nx run esl-website:run',
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
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
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
