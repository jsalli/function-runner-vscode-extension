# Setup
- Install pnpm @microsoft/rush yarn
  ```bash
  npm install -g pnpm @microsoft/rush yarn
  ```

- Install packages
  ```bash
  rush update
  ```

- Tests use nvm to switch between node versions. So you might been to install nvm too

## Windows remarks
This repo has been tested on Windows by using Git Bash as the terminal. PowerShell has not been tested.

# Debug

```bash
cd packages/vscode-extension
pnpm bundle-dependencies-dev
```

- Press F5 to start debugging

# Test the VSCode extension

- Initialize test fixture project's for tests
```bash
. ./packages/vscode-extension/init-test-fixtures.sh
```
## Linux and MacOS
- Run tests

```bash
cd packages/vscode-extension
pnpm test-e2e-multiple-setups
```

## Windows
- Run tests
  - `test-e2e-multiple-setups` script uses NVM to switch between node versions. This does not work on Windows so use the `TESTING_IN_CLOUD_PIPELINE` env var to make the tests use only the installed version of node
```bash
cd packages/vscode-extension
TESTING_IN_CLOUD_PIPELINE=true pnpm test-e2e-multiple-setups
```

# Packaging the Extension

```bash
cd packages/vscode-extension
pnpm package-extension-prod
```

# Publishing VSCode extension

- Update VSCode extension's CHANGELOG.md
- Increase VSCode extension's package.json version
- Publishing is done via Github Actions workflow when a tag beginning with a `v` is pushed to origin.
```bash
# Example for v1.0.0
git tag v1.0.0
git push origin v1.0.0
```

# Marketplace link
You can find the marketplace from [here](https://marketplace.visualstudio.com/items?itemName=function-runner.function-runner-vscode-extension)