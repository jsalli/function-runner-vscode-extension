"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const myArg = "undefined";
const testFunctions1_ts_1 = require("./testFunctions1.ts");
async function ___main() {
    let output = "";
    try {
        output = (0, testFunctions1_ts_1.namedArrowFunction)(myArg);
    }
    catch (error) {
        output = `Function throws an exception:\nClass: ${error.constructor.name}\nMessage: ${error.message}`;
    }
    console.log("===== Function output =====");
    console.log(output);
    console.log();
}
___main();
