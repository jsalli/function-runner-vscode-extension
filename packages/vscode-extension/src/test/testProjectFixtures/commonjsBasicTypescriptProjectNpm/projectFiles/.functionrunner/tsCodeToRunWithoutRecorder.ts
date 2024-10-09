/*Give inputs for "namedArrowFunction"-function.
You might need to save this unsaved tab to a file.
@functionrunner file-id {"functionName":"namedArrowFunction","filePath":"/home/juha/workspaces/vscode-extensions/function-runner/function-runner-monorepo/packages/vscode-extension/src/test/testProjectFixtures/commonjsBasicTypescriptProjectNpm/projectFiles/src/testFunctions1.ts"}
*/

/*You can setup here what ever you need for the function to run
=======================
*/
//process.env.MY_ENV_VAR = "my_value"
//const dbConnection = await someDbConnectionCreator(...)

/*
@functionrunner input set
=======================
*/
const myArg = "undefined";


import { namedArrowFunction } from "./testFunctions1.ts";
async function ___main() { let output = ""; try {
    output = namedArrowFunction(myArg);
}
catch (error) {
    output = `Function throws an exception:\nClass: ${error.constructor.name}\nMessage: ${error.message}`;
} console.log("===== Function output ====="); console.log(output); console.log(); }
___main();
