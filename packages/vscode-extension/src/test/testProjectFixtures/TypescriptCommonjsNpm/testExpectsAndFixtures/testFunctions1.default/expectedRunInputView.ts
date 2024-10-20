/*Give inputs for "default"-function.
You might need to save this unsaved tab to a file.
@functionrunner file-id **file-id-here**
*/
/*
@functionrunner input set
=======================
*/
const myArg = undefined;
const secondArg = undefined;

/*This code executes the function
=======================
*/
import defaultExportedFunction from "./testFunctions1.ts";
async function main() {
  try {
    /*You can setup here what ever you need for the function to run
    =======================
    */
    //process.env.MY_ENV_VAR = "my_value"
    //const dbConnection = await someDbConnectionCreator(...)

    const output = defaultExportedFunction(myArg, secondArg);
    console.log("===== Function output =====");
    console.log(output);
    console.log();
  }
  catch (error) {
    console.log(`Function throws an exception:\nClass: ${error.constructor.name}\nMessage: ${error.message}`);
  }
}

void main();
