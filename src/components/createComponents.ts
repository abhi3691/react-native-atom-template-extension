import * as vscode from "vscode";
import * as path from "path";
import { createFiles } from "../functions/createFiles";

export const createComponents = vscode.commands.registerCommand(
  "react-native-atom-template.createComponents",
  async (uri: vscode.Uri) => {
    try {
      // Check for active workspace folders
      const workspaceFolders = vscode.workspace.workspaceFolders;

      if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage("No workspace folder found.");
        return;
      }

      const projectRoot = workspaceFolders[0].uri.fsPath; // Assume the first workspace folder
      const srcDirectory = path.join(projectRoot, "src");

      // Determine default folder for selection
      let defaultUri = vscode.Uri.file(srcDirectory); // Default to "src" directory
      if (
        vscode.window.activeTextEditor &&
        vscode.window.activeTextEditor.document.uri.fsPath.startsWith(
          srcDirectory
        )
      ) {
        defaultUri = vscode.Uri.file(
          path.dirname(vscode.window.activeTextEditor.document.uri.fsPath)
        );
      }

      // Show folder picker dialog
      const folderUri = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        openLabel: "Select Folder",
        defaultUri: uri || defaultUri, // Use provided URI or calculated default
      });

      if (!folderUri || folderUri.length === 0) {
        vscode.window.showInformationMessage("Folder selection canceled.");
        return;
      }

      const selectedFolder = folderUri[0].fsPath;

      // Prompt the user for the component folder name
      const folderName = await vscode.window.showInputBox({
        prompt: "Enter a name for the component folder",
        validateInput: (input) => {
          if (!input || input.trim().length === 0) {
            return "Folder name cannot be empty.";
          }
          return null;
        },
      });

      if (!folderName) {
        vscode.window.showInformationMessage("Folder creation canceled.");
        return;
      }

      // Call the function to create files in the selected folder
      createFiles(selectedFolder, folderName);

      vscode.window.showInformationMessage(
        `Component folder "${folderName}" created in ${selectedFolder}.`
      );
    } catch (error) {
      if (error instanceof Error) {
        // Safely access the error message
        vscode.window.showErrorMessage(`An error occurred: ${error.message}`);
        console.error("Error in createComponents command:", error);
      } else {
        // Handle unexpected error types
        vscode.window.showErrorMessage("An unknown error occurred.");
        console.error("Unknown error:", error);
      }
    }
  }
);
