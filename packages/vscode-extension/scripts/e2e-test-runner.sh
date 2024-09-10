#!/bin/bash

# $1 = testProjectFixtureName
# $2 = vscode version
function run_tests_for_project() {
    echo "===="
    echo "==== Runnning E2E tests for project '$1' with VSCode version '$2'===="
    echo "===="
    node ./out/test/runTest.js $1 $2
    echo "===="
    echo "==== Done ===="
    echo "===="
    echo
}

pnpm pretest-webpack

run_tests_for_project commonjsBasicTypescriptProjectNpm 1.58.1
run_tests_for_project commonjsMonoRepoTypescriptProjectRushJs 1.60.0
run_tests_for_project esModuleBasicJavascriptProjectPnpm 1.67.2
run_tests_for_project esModuleBasicTypescriptProjectPnpm 1.72.0
run_tests_for_project esModuleBasicTypescriptProjectYarn1 1.72.0
