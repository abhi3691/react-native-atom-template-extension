import * as vscode from "vscode";

import { disposable } from "./createReactNativeProject";
import { setupDisposable } from "./setupReactNativeProject";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "react-native-atom-template" is now active!'
  );

  context.subscriptions.push(disposable, setupDisposable);
}

export function deactivate() {}
