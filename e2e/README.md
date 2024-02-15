# ESL Internal Automation Testing 

## Introduction
This is an internal package for visual automation testing the ESL. 
It is designed to be used by the ESL team to test the ESL library by checking the visual consistency of `@exadel/esl-website` submodule.

## Installation

There are no extra pre-conditions to develop new visual tests locally, 
everything to start will be already installed with root package installation.

**⚠️ Except for one critical thing: all final snapshots should be created on Linux based OS (the latest version of Ubuntu is recommended) ⚠️**

Visual testing depends on font rendering so snapshots created on different OS may be different.
The main (remote) environment for visual testing runs via GitHub Workflows on the latest version of Ubuntu.

### Creating snapshots and running existing tests on Windows

To create snapshots on Windows, you need to use WSL (Windows Subsystem for Linux) and follow the next steps:

1. Install WSL (https://docs.microsoft.com/en-us/windows/wsl/install)
2. Install Ubuntu from Microsoft Store (https://www.microsoft.com/en-us/p/ubuntu/9nblggh4msv6)
3. Run Ubuntu and install Node.js and npm with subsystem CLI. 
   To simplify the process, you can use `nvm` (Node Version Manager). 
   Use the following commands to install `nvm` and the latest Node.js version:
   ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    nvm install node@20
    nvm use node@20
   ```
4. Install Chromium browser (https://learn.microsoft.com/en-us/windows/wsl/tutorials/gui-apps#install-google-chrome-for-linux):
   ```bash
   sudo apt-get update
   sudo apt-get install -y chromium-browser
   ```
5. Install additional dependencies to run puppeteer:
   ```bash
   sudo apt install libgtk-3-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2
   ```
   Note: you might need to restart your subsystem after steps 4 and 5.
6. Open the project folder via WSL terminal and run `npm install` to ensure all dependencies are installed.
7. Use `e2e` package scripts to create snapshots and run tests:
   - `npm run test:e2e` (in the root package) or `npm run run` (in the sub-package) to run all tests (missing snapshots will be created automatically)
   - `npm run test:e2e:update` (in the root package) or `npm run run:update` (in sub-package) to update all snapshots

### Creating snapshots and running existing tests on Mac

TODO: add instructions for Mac OS

### Creating snapshots and running existing tests on Linux

To create snapshots on Linux, you can use any Linux distribution, but the latest version of Ubuntu is recommended.

1. Install the ESL root package and all dependencies according to the root package README.md.
2. Ensure you have Chromium browser installed:
   ```bash
   sudo apt-get update
   sudo apt-get install -y chromium-browser
   ```
3. Use `e2e` package scripts to create snapshots and run tests:
   - `npm run test:e2e` (in the root package) or `npm run run` (in sub-package) to run all tests (missing snapshots will be created automatically)
   - `npm run test:e2e:update` (in the root package) or `npm run run:update` (in sub-package) to update all snapshots


### Full list of available commands

All mentioned commands are available in the root package and in the `e2e` package only. 
Use explicit workspace name to run following commands from the root package.  

- `npm run run` - run all visual tests (run server automatically, create missing snapshots)
- `npm run run:update` - update all snapshots (run server automatically)
- `npm run run:server` - shortcut to run server for visual tests (uses `esl-website` package)
- `npm run run:update:only` - update all snapshots, does not run server (ensure you run server manually)
- `npm run run:server:only` - run server for visual tests, does not run tests

Note: default server port for visual tests is `3007`.

## Updating snapshots using GitHub project workflow

The Automated tests workflow allows you to trigger it manually, it will update all snapshots and commit changes on the branch you specify.

Make sure you have permission to run workflows in the ESL repository or ask the ESL Maintainers team to run the proper update for you.

To trigger the workflow manually, follow these steps:

1. Open the ESL repository in your browser.
2. Go to the "Actions" tab.
3. Find the "Automated tests" workflow and click on it.
4. Click on the "Run workflow" button.
5. Specify the branch you want to update
6. Make sure you check the "Update snapshots" checkbox
7. Click on the "Run workflow" button. 

The update-commit will be created and pushed to the specified branch under your GitHub account.

## Check Automation Test Results

Automated tests run inside GitHub Workflows environment automatically on every push or pull request to the `main`, `main-beta` and `epic:*` branches.

To check the results of the latest run, follow these steps:

1. Open the ESL repository in your browser.
2. Go to the "Actions" tab or find the "Automated tests" workflow in the "Pull requests" checks.
3. Find the latest run and click on it.

You can find the test results in the Summary section or you can download full results as workflow run artifacts.
