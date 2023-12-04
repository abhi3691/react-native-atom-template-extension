import * as vscode from "vscode";


export function getFileNamePrompt(): Thenable<string | undefined> {
    return vscode.window.showInputBox({
      prompt: "Enter the file name:",
      placeHolder: "Enter react native componts name",
    });
  }