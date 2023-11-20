import * as vscode from "vscode";

import { disposable } from "./createReactNativeProject";
import { setupDisposable } from "./components/setupReactNativeProject";
import { SidebarProvider } from "./components/SideBarPorvider";



export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "react-native-atom-template" is now active!'
  );
  const sidebarProvider = new SidebarProvider(context.extensionUri);


  context.subscriptions.push(disposable, setupDisposable);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider('rn-atom-sidebar', sidebarProvider ));


}

export function deactivate() {}
