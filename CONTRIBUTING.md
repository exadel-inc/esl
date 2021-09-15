# Contributing to ESL

Hello potential ESL contributor. We are really glad you are going to support ESL.
But before submitting your contribution, please make sure to take a moment and read through the following guidelines:
  - [Code Of Conduct](https://github.com/exadel-inc/esl/blob/HEAD/CODE_OF_CONDUCT.md)
  - [Contributor Licence Agreement](https://github.com/exadel-inc/esl/blob/HEAD/CLA.md)  
  - [Creating an issue](#new_issue)
  - [Creating a Pull Request](#new_pr)
    - [Development Guide](https://github.com/exadel-inc/esl/blob/HEAD/docs/DEVELOPMENT.md)
    - [Commit Convention](https://github.com/exadel-inc/esl/blob/HEAD/docs/COMMIT_CONVENTION.md)
    - [Outside Contributors Process](#outside_contributor) 
    - [Project Branches and Releases](#branches)  
    
##  Creating an issue

In case you are going to create a new issue for a bug or feature request, 
please use prepared issues templates and make sure you provide all required information
to understand your request. 
Please also try to make sure that issue for bug or feature you are going to create are not presented in the issues list.
Also, please follow the [Code Of Conduct](https://github.com/exadel-inc/esl/blob/HEAD/CODE_OF_CONDUCT.md) guides 
to keep polite and constructive discussions in bounds of the project.


Please don't be shy to suggest new features, improvements or notify us about the bug. 
We are open mind to all suggestions, and will do our best to keep project bugs free 
(in bounds of our abilities and plans of course :) ).

## Creating a Pull Request

If you are going to contribute the project with the code changes please familiar with our 
[Development Guide](https://github.com/exadel-inc/esl/blob/HEAD/docs/DEVELOPMENT.md) and 
[Commit Message Convention](https://github.com/exadel-inc/esl/blob/HEAD/docs/COMMIT_CONVENTION.md).
Please also follow the [Code Of Conduct](https://github.com/exadel-inc/esl/blob/HEAD/CODE_OF_CONDUCT.md) guides 
to keep polite and constructive discussions in bounds of the project.

### Outside Contributors Process

- Fork repository and prepare an update in the proper branch of your fork. 
  Use the `feture/*` or `bugfix/*` prefix for the branch. 
  Use `main` or if you require next release updates `main-beta` branch as a base to cut your branch.
- Make sure your commits are correspond to the project 
  [commit convention](https://github.com/exadel-inc/esl/blob/HEAD/docs/COMMIT_CONVENTION.md).
- Make sure that all tests and lints are passed
- Create a pull request from your fork branch to the original esl repository.  
  _**It's strongly recommended to use `main-beta` branch as a target**_.  
  Please rely on ESL maintainer to rebase PR if it's approved to be merged to the `main` (for 
  the very next ESL version) or to be moved under the proper project's "epic".
- Please use Pull Request Template and be sure to add @exadel-inc/esl-core-team for review.
- Don't forget to agree on the project CLA. The CLA bot will automatically reply to you in the comments. 
  We can not use your contribution to the project until you do that.

### Project Branches and Releases

ESL branches flow is described on the scheme below
![branches flow](./docs/images/branches-process.png)

- `main` - branch has an actual stable release of the library
- `main-beta` - branch for next minor and major releases ot the library
- `epic/*` (e.g `epic/new-big-feature`) - a branch for massive functionality or group of related features
- `feature/*` - a branch for a feature implementation
- `fix/*` or `bugfix/*` - a branch for a bugfix implementation

The following merge flow can be done by all ESL official collaborators:
- `main` -> `main-beta`
- `main` -> `epic/*`
- `main-beta` -> `epic/*` (if epic is not going to be part of current stable major release)

**The merge into `main` branch is a part of release processes and allowed for maintainers (@exadel-inc/esl-core-team) only.**
