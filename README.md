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
- Run tests

```bash
cd packages/vscode-extension
pnpm test-e2e-multiple-setups
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
