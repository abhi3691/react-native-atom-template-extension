import * as vscode from "vscode";
import * as path from "path";
import * as os from "os";

import { checkJavaVersion } from "../functions/checkJavaVersion";
import { ProjecrCreation } from "../functions/projectCreation";

export const disposable = vscode.commands.registerCommand(
  "react-native-atom-template.createReactNativeProject",
  async () => {
    // Select a folder for the project
    const folderUri = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: "Open",
    });

    if (!folderUri || folderUri.length === 0) {
      vscode.window.showErrorMessage(
        "No folder selected. Please select a folder to create the project."
      );
      return;
    }

    const selectedFolder = folderUri[0].fsPath;

    // Get the project name from the user
    const projectName = await vscode.window.showInputBox({
      prompt: "Enter the name for your React Native project",
      ignoreFocusOut: true,
    });

    if (!projectName) {
      vscode.window.showErrorMessage(
        "Project name is required. Please enter a valid name."
      );
      return;
    }

    // Define the destination folder for the new project
    const destinationFolder = path.join(selectedFolder, projectName);

    const isJavaVersionValid = checkJavaVersion();

    if (isJavaVersionValid) {
      // Configure progress options for the status bar
      const progressOptions: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: `Creating React Native project '${projectName}'`,
      };
      const command = `npx @react-native-community/cli@latest  init ${projectName}`;

      ProjecrCreation({
        progressOptions,
        selectedFolder,
        projectName,
        destinationFolder,
        command,
      });
    } else {
      const answer = await vscode.window.showInformationMessage(
        "Java version 17 or higher is required. Do you want to install Java 17 or higher version?",
        "yes",
        "No, Start with 0..72.7"
      );

      if (answer === "yes") {
        const devOS =
          os.platform() === "linux"
            ? "linux"
            : os.platform() === "win32"
            ? "windows"
            : "mac";
        vscode.env.openExternal(
          vscode.Uri.parse(
            `https://reactnative.dev/docs/environment-setup?platform=android&os=${devOS}`
          )
        );
      } else {
        // Configure progress options for the status bar
        const progressOptions: vscode.ProgressOptions = {
          location: vscode.ProgressLocation.Notification,
          title: `Creating React Native project '${projectName} with react-native 0.72.7'`,
        };
        const command = `npx react-native init ${projectName} --version 0.72.7`;

        ProjecrCreation({
          progressOptions,
          selectedFolder,
          projectName,
          destinationFolder,
          command,
        });
      }
    }
  }
);
