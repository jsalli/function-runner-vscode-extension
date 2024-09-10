import { Range, TextDocument } from "vscode";

export function isInputSetView(document: TextDocument): boolean {
  const firstLineRange = new Range(0, 0, 0, 100);
  const firstLineContent = document.getText(firstLineRange);
  const testInputViewMatchToFind = "function's run cases";
  return firstLineContent.includes(testInputViewMatchToFind);
}