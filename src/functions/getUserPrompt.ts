import * as vscode from "vscode";

export function getUserPrompt(): Thenable<string | undefined> {
    return vscode.window.showInputBox({
      prompt: "Describe your React Native Component:",
    });
  }