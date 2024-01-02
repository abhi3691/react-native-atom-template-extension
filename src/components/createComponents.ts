import * as vscode from "vscode";
import * as path from "path";

import { createFiles } from "../functions/createFiles";

export const createComponents = vscode.commands.registerCommand(
  "react-native-atom-template.createComponents",
  async () => {
    const projectRoot = vscode.workspace.workspaceFolders;

    if (projectRoot && projectRoot.length > 0 && projectRoot[0]?.uri?.fsPath) {
      const directoryPath = path.join(projectRoot[0]?.uri?.fsPath, "src");

      // Check if any file is currently open
      const activeEditor = vscode.window.activeTextEditor;
      let defaultUri;
      if (
        activeEditor &&
        activeEditor.document.uri.fsPath.startsWith(directoryPath)
      ) {
        // If a file is open in the "src" directory, use its directory as the default
        defaultUri = vscode.Uri.file(
          path.dirname(activeEditor.document.uri.fsPath)
        );
      } else {
        // Otherwise, use the project root "src" directory as the default
        defaultUri = vscode.Uri.file(directoryPath);
      }

      // Show a folder picker dialog
      const folderUri = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        openLabel: "Select Folder",
        defaultUri: defaultUri,
      });

      // If the user selected a folder, proceed with your logic
      if (folderUri && folderUri[0]) {
        const selectedFolder = folderUri[0].fsPath;

        // Ask the user to input a folder name
        const folderName = await vscode.window.showInputBox({
          prompt: "Enter a name for the component folder",
        });

        // If the user provided a folder name, proceed with file creation
        if (folderName) {
          createFiles(selectedFolder, folderName);
        } else {
          // User canceled the folder name input
          vscode.window.showInformationMessage("Folder creation canceled.");
        }
      } else {
        // User canceled the folder selection
        vscode.window.showInformationMessage("Folder selection canceled.");
      }
    } else {
      vscode.window.showErrorMessage("No workspace folder found.");
    }
  }
);
