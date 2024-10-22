# Functio Runner VSCode extension

Function Runner helps you run and test functions you have written. The extension supports currently Javascript and Typescript but support to other languages can be added.

## Running and Debugging a function with inputs

You can execute functions you have written with a couple of clicks.

1. Click the `Run or Debug Function` codelens to open an input set view
    - Here you can give inputs to the function and edit the code executing it as you see fit
1. Click the `Run this` codelens to run the function
    - You see the output of the function execution in the opened output terminal
1. Click the `Debug this` codelens to start a debugging session.
    - Function output is shown in the opened debug console

<p align="center">
  <picture>
      <!-- <source srcset="https://github.com/jsalli/function-runner-vscode-extension/raw/HEAD/packages/vscode-extension/images/docs/function-runner-usage-example.webp" type="image/webp"> -->
      <!-- <source srcset="https://github.com/jsalli/function-runner-vscode-extension/raw/HEAD/packages/vscode-extension/images/docs/function-runner-usage-example.gif" type="image/gif"> -->
      <img src="./images/docs/function-runner-usage-example.gif" alt="Function Runner usage example">
  </picture>
</p>

### Note for Yarn users

You might need to add the following line to the `settings.json`-file in the `.vscode`-folder. This will override the default value as there is some issue with Yarn loading the ts-node ESM loader with the default value.

```json
  "functionrunner.typescriptRunOptions.envVarsWhenESModule": {
    "NODE_OPTIONS": "--no-warnings --experimental-specifier-resolution=node --loader {{tsNodeInstallationPath}}/esm/transpile-only.mjs --input-type module",
    "TS_NODE_TRANSPILE_ONLY": "true",
    "TS_NODE_PROJECT": "{{tsConfigJsonFileAbsPath}}",
    "TS_NODE_CWD": "{{sourceFileDirAbsPath}}"
  }
```

## Settings
There are allkinds of settings to customize the function execution. See the available settings from the extension's `package.json` file's `configuration`-section [here](https://github.com/jsalli/function-runner-vscode-extension/blob/main/packages/vscode-extension/package.json)