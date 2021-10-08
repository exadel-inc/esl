# Contributing to ESL

Hello potential ESL contributor. We are really glad you are going to support ESL.
But before submitting your contribution, please make sure to take a moment and read through the following guidelines:
  - [🔗 Code Of Conduct](CODE_OF_CONDUCT.md)
  - [🔗 Contributor Licence Agreement](CLA.md)  
  - [Creating an issue](#creating-an-issue)
  - [Creating a Pull Request](#creating-a-pull-request)
    - [🔗 Development Guide ❕🔥](docs/DEVELOPMENT.md)
    - [🔗 Commit Convention ❕🔥](docs/COMMIT_CONVENTION.md)
    - [Outside Contributors Process](#outside-contributors-process) 
    - [Project Branches and Releases](#project-branches-and-releases)  
    
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
  [commit convention](docs/COMMIT_CONVENTION.md).
- Make sure that all tests and linter checks are passed
- Create a pull request from your fork branch to the original ESL repository.  
  _**It's strongly recommended to use `main-beta` branch as a target**_.  
  Please rely on ESL maintainer to rebase PR if it's approved to be merged to the `main` (for 
  the very next ESL version) or to be moved under the proper project's "epic".
- Please use [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md) and be sure to add @exadel-inc/esl-core-team for review.
- Don't forget to agree on the project CLA. The CLA bot will automatically reply to you in the comments. 
  We can not use your contribution to the project until you do that.

### Project Branches and Releases

ESL internal branches flow is described on the scheme below
![branches flow](./docs/images/branches-process.png)

- `main` - branch has an actual stable release of the library
- `main-beta` - branch for next minor and major releases ot the library
- `epic/*` (e.g `epic/new-big-feature`) - a branch for massive functionality or group of related features
- `feat/*` or `feature/*` - a branch for a feature implementation
- `fix/*` or `bugfix/*` - a branch for a bugfix implementation
- `docs/*` - branch with the documentation or demo content updates (TS Docs, GHPages content, README, etc.)
- `tech/*` - common updates regarding build process, configuration, linters and other technical changes 
that are not affecting library output (npm package) 

The following merge flow can be done by all ESL official collaborators:
- `main` -> `main-beta`
- `main` -> `epic/*`
- `main-beta` -> `epic/*` (if epic is not going to be part of current stable major release)

**The merge into `main` branch is a part of release processes and allowed for maintainers (@exadel-inc/esl-core-team) only.**
