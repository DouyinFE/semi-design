# Contributing

We are glad that you are interested in contributing to Semi UI. Please take some minutes to read the following guidelines:
## Branch Management
 - main: Normally, the branch is just a snapshot of the latest stable release. We will merge the `beta` to this branch releasing a minor version every two weeks. If an emergency bug is fixed, we will release a patch version on this branch.
 - beta: For bug fixes and feature development. The beta version will be released based on this branch one week after the minor version is released
## Bug
We use Github issues to track bugs. In order to understand and fix bugs faster, when reporting a bug, you can also reproduce the problem through the template we provide. we recommend you
## Feature
If you have an idea to provide or optimize features, we recommend that you use Github issues to suggest a new issue
## Pull Request Guidelines
The Semi Design team will take every Pull Request seriously. We will review and merge your code. It is also possible to suggest some modifications to your code.
To open a Pull Request, please follow the steps below:
 - Fork our repo, then clone your fork
```bash
git clone https://github.com/<your-username>/semi-ui.git
cd semi-ui
```
 - Checkout to `beta` branch, install the dependencies
```bash
git checkout beta
npm run bootstrap
```
 - Next, make the modifications you want to make, which can be bug fixes or development of new features
 - You can verify your change by running storybook (`npm start`) and official website (`npm run docstie`) locally
 - Add accompanying tests for your change, ensure all tests pass
```bash
npm run test:unit
```
 - Open a Pull Request against `beta` of source repo

## Help Improve the Docs
The documentation site is based on [gatsby](https://www.gatsbyjs.com/), and the code is in the `src` directory.

**The component documentation is located in the md file under the `semi-ui` component folder. ** Take tooltip as an example:

* Chinese document `packages/semi-ui/tooltip/index.md` 
* English document `packages/semi-ui/tooltip/index-en-US.md`
To get started:
```sh
npm run docsite
```
If you are interested in helping us improve the doc, please modify the md file of the component and submit your changes according to the Pull Request guidelines