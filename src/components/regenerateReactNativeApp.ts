import * as vscode from "vscode";
import path from "path";
import { getApiModel, getChatGPTApiKey } from "../functions/getChatGPTApiKey";
import { getUserPrompt } from "../functions/getUserPrompt";
import { generateApp } from "../functions/generateApp";
import { isReactNativeCode } from "../functions/isReactNativeCode";

export const regenerateReactNativeApp = vscode.commands.registerCommand(
  "react-native-atom-template.regenerateReactNativeApp",
  async () => {
    const apiKey = await getChatGPTApiKey();
    const model = await getApiModel();
    if (!apiKey) {
      // User canceled or entered an invalid key, no error message needed
      return;
    }
    if (!model) {
      return;
    }

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No file is currently open.");
      return;
    }

    const filePath = editor.document.fileName;
    const fileContent = editor.document.getText();
    // Check if the file appears to be React Native code
    if (!isReactNativeCode(fileContent)) {
      vscode.window.showErrorMessage("This is not a React Native file.");
      return;
    }

    const relativePath = vscode.workspace.asRelativePath(filePath);
    const fileName = path.basename(filePath);

    const joindPath = path.join(
      path.dirname(relativePath).replace(/^src\//, ""),
      path.basename(relativePath, ".tsx")
    );

    const description = await getUserPrompt();
    if (description && fileName) {
      await generateApp(joindPath, description, apiKey, model);
    }
  }
);
