#!/bin/bash

# First add execution permission for this file with "chmod +x scripts/init-project.sh".
# Run the above command from the project root path

# Run this script from the project root folder with command ""./scripts/init-project.sh"

# ===
# === TELL WHAT'S GONNA HAPPEN ===
# ===
echo
echo "=== This script will install the node packages to the the test project fixtures"
echo

# $1 = testProjectFixtureName
# $2 = install command
function cd_and_install() {
    echo "===="
    echo "==== Installing project '$1' ===="
    echo "===="
    cd src/test/testProjectFixtures/$1/projectFiles
    $2
    echo "===="
    echo "==== Installing Done ===="
    echo "===="
    echo
    cd ../../../../..
}


if [[ ( -z "$1" ) || ( "$1" -eq 1 ) ]]; then
    echo "===="
    echo "==== Installing PNPM globally ===="
    echo "===="
    npm install -g pnpm

    echo "===="
    echo "==== Installing RUSH JS globally ===="
    echo "===="
    npm install -g @microsoft/rush

    echo "===="
    echo "==== Installing Yarn globally ===="
    echo "===="
    npm install -g yarn
fi

# cd_and_install commonjsBasicJavascriptProjectNpm 'npm install'
cd_and_install commonjsBasicTypescriptProjectNpm 'npm install'
cd_and_install commonjsMonoRepoTypescriptProjectRushJs 'rush update'
cd_and_install esModuleBasicJavascriptProjectPnpm 'pnpm install'
cd_and_install esModuleBasicTypescriptProjectPnpm 'pnpm install'
cd_and_install esModuleBasicTypescriptProjectYarn1 'yarn set version classic && yarn install'
# For below Yarn init Yarn version > 2 needs a yarn.lock file to exist. Otherwise it will give an error:
# Usage Error: Cannot use the --install flag from within a project subdirectory
# cd_and_install esModuleBasicTypescriptProjectYarn3 'touch yarn.lock && yarn set version berry && yarn install && yarn dlx @yarnpkg/sdks vscode'