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
cd_and_install() {
    echo "===="
    echo "==== Installing project '$1' ===="
    echo "===="
    cd src/test/testProjectFixtures/$1/projectFiles
    ./initializeProject.sh
    echo "===="
    echo "==== Installing Done ===="
    echo "===="
    echo
    cd ../../../../..
}


# if [[ ( -z "$1" ) || ( "$1" -eq 1 ) ]]; then
    if ! pnpm help > /dev/null 2>&1; then
        echo "===="
        echo "==== Installing PNPM globally ===="
        echo "===="
        npm install -g pnpm
    fi

    if ! rush -h > /dev/null 2>&1; then
        echo "===="
        echo "==== Installing RUSH JS globally ===="
        echo "===="
        npm install -g @microsoft/rush
    fi

    if ! yarn -h > /dev/null 2>&1; then
        echo "===="
        echo "==== Installing Yarn globally ===="
        echo "===="
        npm install -g yarn
    fi
# fi


cd_and_install TypescriptCommonjsNpm
cd_and_install TypescriptCommonjsMonoRepoRushJs
cd_and_install JavascriptEsModuleNpm
cd_and_install TypescriptEsModulePnpm
cd_and_install TypescriptEsModuleYarn4 
