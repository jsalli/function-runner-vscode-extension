# Functio Runner VSCode extension

Function Runner helps you run and test functions you have written.

## Running a function with inputs

Testent can also execute your function with the given inputs for you to test what the function returns or throws.

<p align="center">
  <img src="./images/docs/testent-execute-function-preview.gif" alt="Preview of Testent running function with inputs" />
</p>

<br/><br/>

## Settings

You can change some settings by editing `settings.json`-file in `.vscode`-folder or from menu `File->Preferences->Settings->Extensions->Testent`

### General

- `testent.general.sourceFolder`
  - Specifies folder where source files are with relation to project root folder. If source is at root folder set empty string as value
  - Default `src`

### Logging

- `testent.logging.outputLevel`
  - Specifies how much (if any) output will be sent to the GitLens output channel
  - Options: `silent`, `errors`, `verbose`, `debug`
  - Default `errors`

### Testent Code Lens

- `testent.codeLens.enabled`
  - Specifies whether to provide any code lens.
  - Default `true`

### Terminal Options

- `testent.terminalOptions.windowsTerminalType`

  - Specify the Windows terminal to use
  - Options: `powerShell`, `bashKind`, `cmd`
  - Default `powerShell`

- `testent.terminalOptions.windowsTerminalExecutablePath`

  - Specify absolutepath to the terminal executable
  - Default `C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`

- `testent.terminalOptions.linuxTerminalType`

  - Specify terminal to use in Linux
  - Options: `bash`, `sh`,
  - Default `bash`

- `testent.terminalOptions.linuxTerminalExecutablePath`

  - Specify absolutepath to the terminal executable or empty string if your default shell is supported
  - Default `""`

- `testent.terminalOptions.macTerminalType`

  - Specify terminal to use in Mac
  - Options: `zsh`, `bash`,
  - Default `zsh`

- `testent.terminalOptions.macTerminalExecutablePath`
  - Specify absolutepath to the terminal executable or empty string if your default shell is supported
  - Default `""`

### Javascript Run Options

- `testent.javascriptRunOptions.commonPreExecutable`

  - Specifies things to add to the terminal execution command before the `testent.runOptions.executable`
  - Default `""`

- `testent.javascriptRunOptions.envVarsWhenESModule`

  - Specifies environmental variables for when running ES module. Available variables are `sourceFileDirAbsPath`, `tsConfigJsonFileAbsPath`, `tsNodeInstallationPath`. Surround vars with `{{` and `}}`
  - Default
    ```json
    {
    	"NODE_OPTIONS": "--no-warnings --experimental-specifier-resolution=node --input-type module"
    }
    ```

- `testent.javascriptRunOptions.envVarsWhenCommonJS`

  - Specifies environmental variables for when running CommonJS module. Available variables are `sourceFileDirAbsPath` and `tsConfigJsonFileAbsPath`, `tsNodeInstallationPath`. Surround vars with `{{` and `}}`
  - Default

  ```json
  {
  	"NODE_OPTIONS": "--no-warnings --experimental-specifier-resolution=node"
  }
  ```

- `testent.javascriptRunOptions.socketPort`
  - Specifies port for socket communication between extension and user's instrumented code running in an child process.
  - Default `7123`

### Typescript Run Options

- `testent.typescriptRunOptions.commonPreExecutable`

  - Specifies things to add to the terminal execution command before the `testent.runOptions.executable`
  - Default `""`

- `testent.typescriptRunOptions.envVarsWhenESModule`

  - Specifies environmental variables for when running ES module. Available variables are `sourceFileDirAbsPath`, `tsConfigJsonFileAbsPath`, `tsNodeInstallationPath`. Surround vars with `{{` and `}}`
  - Default
    ```json
    {
    	"NODE_OPTIONS": "--no-warnings --experimental-specifier-resolution=node --loader {{tsNodeInstallationPath}}/ts-node/esm/transpile-only.mjs --input-type module",
    	"TS_NODE_TRANSPILE_ONLY": "true",
    	"TS_NODE_PROJECT": "{{tsConfigJsonFileAbsPath}}",
    	"TS_NODE_CWD": "{{sourceFileDirAbsPath}}"
    }
    ```

- `testent.typescriptRunOptions.envVarsWhenCommonJS`

  - Specifies environmental variables for when running CommonJS module. Available variables are `sourceFileDirAbsPath` and `tsConfigJsonFileAbsPath`, `tsNodeInstallationPath`. Surround vars with `{{` and `}}`
  - Default

  ```json
  {
  	"NODE_OPTIONS": "--no-warnings --experimental-specifier-resolution=node -r {{tsNodeInstallationPath}}/ts-node/register/index.js",
  	"TS_NODE_TRANSPILE_ONLY": "true",
  	"TS_NODE_PROJECT": "{{tsConfigJsonFileAbsPath}}",
  	"TS_NODE_CWD": "{{sourceFileDirAbsPath}}"
  }
  ```

- `testent.typescriptRunOptions.tsconfigRelPath`

  - Specify relative path to tsconfig-file in relation to project's root path and the name of the file
  - Default `./tsconfig.json`

- `testent.typescriptRunOptions.socketPort`
  - Specifies port for socket communication between extension and user's instrumented code running in an child process.
  - Default `7123`
