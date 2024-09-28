# Setup

- npm install -g @microsoft/rush
- npm install -g pnpm
- pnpm setup
- rush update
- Log out from the computer and Log back in to make your profile update with new executables pnpm
- In Linux see that `~/.profile` and `~/.bashrc` both have PNPM settings something like

  ```
  # pnpm
  export PNPM_HOME="/home/juha/.local/share/pnpm"
  export PATH="$PNPM_HOME:$PATH"
  # pnpm end
  ```

  - If you are NVM see that you have also something like the following

  ```
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
  ```

## Windows specific

- In Windows make sure you have installed [Redistributable C++ 2015](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170) https://aka.ms/vs/17/release/vc_redist.x64.exe
- Start a PowerShell `with Administrator rights` and run the following or similar command to allow process spawning
  ```bash
  Set-ExecutionPolicy RemoteSigned
  ```

# Debug

```bash
cd packages/vscode-extension
pnpm bundle-dependencies-dev
```

- Press F5 to start debugging

# Test VSCode extension

- Install test fixture project's packages
  ```bash
  cd packages/vscode-extension/src/test/testWorkspaceProjectFixture
  npm i
  ```
- Run tests
  ```bash
  cd packages/vscode-extension
  pnpm test-unit
  pnpm test-e2e-multiple-setups
  ```

# Packaging the Extension

```bash
cd packages/vscode-extension
pnpm vsce package --no-dependencies
```

# TODO:

- Bundle ESM loader so that javascript projects can import modules without file extension
- Add tests for using .mjs files

- Function call of a object prop.

  ```typescript
  // TODO
  function myFunc(): { name: string } {
  	return { name: 'John' };
  }
  const result = myfunc(myInputArg);
  const myVar = result.name.toLowerCase(); // <-----
  return myVar;
  ```

# Integrations todo

- [Gitpod.io](https://www.gitpod.io/)
- https://open-vsx.org/ marketplace
  - https://github.com/HaaLeo/publish-vscode-extension

# Publishing VSCode extension

- Update VSCode extension's CHANGELOG.md
- Increase VSCode extension's package.json version

- Push changes to Git

  ```bash
  # In the project's root folder
  git add .
  git commit -m "my message"
  git push
  ```

- Build and test on Linux, Windows and Mac

  ```bash
  # In the VSCode extension's folder
  cd packages/vscode-extension
  pnpm package-extension-prod
  pnpm test-unit
  pnpm test-e2e-multiple-setups
  ```

- Move generated files from `publish`-folder's root to `publish/0.1.X`-folder

- Clean the .vsix file

  - Rename the .vsix file the `...-orig.vsix`
  - Unpack the .vsix file
  - Remove the following fields from the package.json
    - scripts
    - dependencies
    - devDependencies
  - Repack the files with zip and rename the created zip to `.vsix` and remove `-orig` from name

- Publish the extension to the Marketplace

  ```bash
  # Replace '0.1.X' with the version number
  # In the VSCode extension's folder
  pnpm publish-extension publish/0.1.X/testent-vscode-extension-0.1.X.vsix
  ```

- If publishing worked tag the commit

  ```bash
  # In the project's root folder
  git tag -a -m "VSCode extension release 0.1.X" "vscode-extension-release-v0.1.X"
  git push origin vscode-extension-release-v0.1.X
  ```

- https://marketplace.visualstudio.com/manage/publishers/testent
- https://itnext.io/creating-and-publishing-vs-code-extensions-912b5b8b529
- https://code.visualstudio.com/api/working-with-extensions/publishing-extension

## From package.json remove the following

- activationEvents: `"onLanguage:javascript"`
- `scripts`, `dependencies`, `devDependencies` fields
