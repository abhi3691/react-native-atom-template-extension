import * as vscode from "vscode";

import { disposable } from "./components/createReactNativeProject";
import { setupDisposable } from "./components/setupReactNativeProject";
import { SidebarProvider } from "./components/SideBarPorvider";
import { generateReactNativeApp } from "./components/generateReactNativeApp";
import { regenerateReactNativeApp } from "./components/regenerateReactNativeApp";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    disposable,
    setupDisposable,
    generateReactNativeApp,
    regenerateReactNativeApp
  );
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "rn-atom-sidebar",
      sidebarProvider
    )
  );
}

export function deactivate() {}
