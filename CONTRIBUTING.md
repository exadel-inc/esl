# Contributing to ESL

<a name="intro"></a>

Hello potential ESL contributor. We are really glad you are going to support ESL.
But before submitting your contribution, please make sure to take a moment and read through the following guidelines:
  - [🔗 Code Of Conduct](https://github.com/exadel-inc/esl/blob/HEAD/CODE_OF_CONDUCT.md)
  - [🔗 Contributor Licence Agreement](https://github.com/exadel-inc/esl/blob/HEAD/CLA.md)  
  - [Creating an issue](#creating-an-issue)
  - [Creating a Pull Request](#creating-a-pull-request)
    - [🔗 Development Guide ❕🔥](https://github.com/exadel-inc/esl/blob/HEAD/docs/DEVELOPMENT.md)
    - [🔗 Commit Convention ❕🔥](https://github.com/exadel-inc/esl/blob/HEAD/docs/COMMIT_CONVENTION.md)
    - [Outside Contributors Process](#outside-contributors-process) 
    - [Project Branches and Releases](#project-branches-and-releases)  
  - [Contributing to ESL Documentation](#contributing-to-esl-documentation)

<a name="creating-an-issue"></a>
##  Creating an issue

In case you are going to create a new issue for a bug or feature request, 
please use prepared issues templates and make sure you provide all required information
to understand your request. 
Please also try to make sure that the issue for the bug or feature you are going to create is not presented in the issues list.
Also, please follow the [Code Of Conduct](CODE_OF_CONDUCT.md) guides 
to keep polite and constructive discussions within the project.


Please don't be shy to suggest new features, improvements or notify us about the bug. 
We are open mind to all suggestions and will do our best to keep project bugs free 
(in bounds of our abilities and plans, of course :) ).

<a name="creating-a-pull-request"></a>
## Creating a Pull Request

If you are going to contribute to the project with the code changes please be familiar with our 
[Development Guide](docs/DEVELOPMENT.md) and 
[Commit Message Convention](docs/COMMIT_CONVENTION.md).
Please also follow the [Code Of Conduct](CODE_OF_CONDUCT.md) guides 
to keep polite and constructive discussions within the project.

### Outside Contributors Process

- Fork the repository and prepare an update in the proper branch of your fork.
  Use one of the `feat/*`, `feature/*`, `fix/*`, `bugfix/*`, `docs/*`, `tech/*` prefixes for the branch.
  Use `main` or if you require the next release updates `main-beta` branch as a base to cut your branch.
- Make sure your commits correspond to the project 
  [commit convention](https://github.com/exadel-inc/esl/blob/HEAD/docs/COMMIT_CONVENTION.md).
- Make sure that all tests and linter checks are passed
- Create a pull request from your fork branch to the original ESL repository.  
  _**It's strongly recommended to use `main-beta` branch as a target**_.  
  Please rely on the ESL maintainers to rebase PR if it's approved to be merged to the `main` (for
  the very next ESL version) or to be moved under the proper project's "epic".
- Please use [Pull Request Template](https://github.com/exadel-inc/esl/blob/HEAD/.github/PULL_REQUEST_TEMPLATE.md) and be sure to add @exadel-inc/esl-core-team for review.
- Don't forget to agree on the project CLA. The CLA bot will automatically reply to you in the comments. 
  We can not use your contribution to the project until you do that.

### Project Branches and Releases

ESL internal branches flow is described on the scheme below  
![branches flow](./docs/images/branches-process.png)

The following branches are used in the project:
- `main` - branch has an actual stable release of the library
- `main-beta` - branch for next minor and major releases of the library
- `epic/*` (e.g `epic/new-big-feature`) - a branch for massive functionality or a group of related features
- `feat/*` or `feature/*` - a branch for a feature implementation
- `fix/*` or `bugfix/*` - a branch for a bugfix implementation
- `docs/*` - branch with the documentation or demo content updates (TS Docs, GHPages content, README, etc.)
- `tech/*` - common updates regarding the build process, configuration, linters and other technical changes
  that are not affecting library output (npm package)

The following merge flow can be done by all ESL official collaborators:
- `main` -> `main-beta`
- `main` -> `epic/*`
- `main-beta` -> `epic/*` (if epic is not going to be part of the current stable major release)


<a name="contributing-to-esl-documentation"></a>
## Contribute to ESL documentation

Find a typo or just want to improve ESL documentation?
Feel free to create a PR with your changes.
You don't need to have a piece of special knowledge or even an open IDE for that.
All ESL documentation is written in markdown and available in the module directory as the `src/module/esl-*/README.md`
file.

Use the following steps to quickly suggest an updates for ESL documentation:
1. Find the right markdown file on GitHub
2. Click on the "Edit this file" link with a pencil icon in the top right corner of the page
3. Make a fork of the repository and create a new branch for your changes
4. Make your changes and check the preview
5. Click on the "Commit changes" button and create a fork branch
6. Fill commit message and description
7. Make sure commit name starts with `docs: ` (or  `docs(esl-*changed module*): `) prefix
8. Click on the "Propose changes" button
9. Confirm your CLA agreement (you will be asked to do that if you haven't done that before
10. You really helped us to improve ESL documentation. Thank you!
