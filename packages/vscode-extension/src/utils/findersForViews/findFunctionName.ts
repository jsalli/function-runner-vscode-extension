import { TextDocument } from "vscode";

const ioViewFunctionNameRegex = /^(@functionrunner input-set-view )(\S*)/gm; // Text is in second capture group

export function findFunctionName(document: TextDocument): string {
  const text = document.getText();
  const functionName = Array.from(text.matchAll(ioViewFunctionNameRegex))[0][2];
  return functionName
}