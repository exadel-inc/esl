# Contributing to ESL

<a name="intro"></a>

Hello, potential ESL contributor! We are really glad you are going to support ESL.
But before submitting your contribution, please make sure to take a moment and read through the following guidelines:
  - [🔗 Code Of Conduct](https://github.com/exadel-inc/esl/blob/HEAD/CODE_OF_CONDUCT.md)
  - [🔗 Contributor Licence Agreement](https://github.com/exadel-inc/esl/blob/HEAD/CLA.md)  
  - [Creating an issue](#creating-an-issue)
  - [Creating a Pull Request](#creating-a-pull-request)
    - [🔗 Development Guide ❕🔥](https://github.com/exadel-inc/esl/blob/HEAD/docs/DEVELOPMENT.md)
    - [🔗 Commit Convention ❕🔥](https://github.com/exadel-inc/esl/blob/HEAD/docs/COMMIT_CONVENTION.md)
    - [Outside Contributions Process](#outside-contributions-process) 
    - [Project Branches and Releases](#project-branches-and-releases)  
  - [Contributing to ESL Documentation](#contributing-to-esl-documentation)

To maintain polite and constructive discussions within the project, please follow the [Code Of Conduct](CODE_OF_CONDUCT.md) guide.

<a name="creating-an-issue"></a>
##  Creating an issue

In case you are going to create a new issue for a bug or feature request, 
please use prepared issues templates and make sure you provide all required information
to understand your request.
Also, please try to make sure that the issue for the bug or feature you are going to create is not present in the issues list.

Please don't be shy to suggest new features, improvements or notify us about any bugs.
We are open to all suggestions and will do our best to keep the project bug-free.

<a name="creating-a-pull-request"></a>
## Creating a Pull Request

If you are going to contribute to the project with the code changes, check out our 
[Development Guide](https://github.com/exadel-inc/esl/blob/HEAD/docs/DEVELOPMENT.md) and 
[Commit Message Convention](https://github.com/exadel-inc/esl/blob/HEAD/docs/COMMIT_CONVENTION.md).

<a name="outside-contributions-process"></a>
### Outside Contributions Process

- Fork the repository and prepare an update in the proper branch of your fork.
  Use one of the `feat/*`, `feature/*`, `fix/*`, `bugfix/*`, `docs/*`, `tech/*` prefixes for the branch.
  Use `main` branch as the base.
- Make sure your commits follow the project 
  [commit convention](https://github.com/exadel-inc/esl/blob/HEAD/docs/COMMIT_CONVENTION.md).
- Make sure that all tests and linter checks are passed.
- Create a pull request from your fork branch to the ESL repository.  
  _**It's strongly recommended to use `main-beta` branch as a target**_.  
  ESL maintainers will rebase your PR to the `main` branch (if it's approved for the next ESL version),
  or move it under the proper project's "epic".
- Please use [Pull Request Template](https://github.com/exadel-inc/esl/blob/HEAD/.github/PULL_REQUEST_TEMPLATE.md) and 
  be sure to add `@exadel-inc/esl-core-team` for review.
- Don't forget to sign the project CLA. The CLA bot will automatically prompt you to do it. 
  We cannot use your contribution to the project without this.


<a name="project-branches-and-releases"></a>
### Project Branches and Releases

ESL internal branches flow is described in the scheme below  
![branches flow](./docs/images/branches-process.png)

The following branches are used in the project:
- `main` branch has the current or the nearest stable release of the library
- `main-beta` branch has the next minor and major releases changes
- `epic/*` (e.g `epic/new-big-feature`) - a branch for new complex functionality or a group of related features
- `feat/*` or `feature/*` - a branch for a feature implementation
- `fix/*` or `bugfix/*` - a branch for a bugfix implementation
- `docs/*` - a branch with the documentation or demo content updates (TS Docs, GHPages content, README, etc.)
- `tech/*` - common updates regarding the build process, configuration, linters, and other technical changes
  that are not affecting library output (npm package)

The following merge flows can be done by all ESL official collaborators:
- `main` -> `main-beta`
- `main` -> `epic/*`
- `main-beta` -> `epic/*` (if the epic is not going to be a part of the current stable major release)

<a name="contributing-to-esl-documentation"></a>
## Contribute to ESL documentation

Found a typo or just want to improve ESL documentation?
Feel free to create a PR with your changes.
You don't need special knowledge or even an open IDE to do this.
All ESL documentation is written in markdown and available in the module directory in `src/module/esl-*/README.md`
files.

Use the following steps to suggest an update to the ESL documentation quickly:

1. Find the right markdown file on GitHub
2. Click the "Edit this file" link with a pencil icon in the top right corner of the page
3. Make a fork of the repository and create a new branch for your changes
4. Make your changes and check the preview
5. Click on the "Commit changes" button and create a fork of the branch
6. Fill commit message and description
7. Make sure the commit name starts with `docs: ` (or `docs(esl-*changed module*): `) prefix
8. Click the "Propose changes" button
9. Confirm your CLA agreement (you will be asked to do this the first time you contribute to the project)
10. You have really helped us to improve the ESL documentation. Thank you!
