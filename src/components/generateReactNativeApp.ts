import * as vscode from "vscode";
import { generateApp } from "../functions/generateApp";
import { getChatGPTApiKey } from "../functions/getChatGPTApiKey";
import { getUserPrompt } from "../functions/getUserPrompt";
import { getFileNamePrompt } from "../functions/getFileNamePrompt";

export const generateReactNativeApp = vscode.commands.registerCommand(
  "react-native-atom-template.generateReactNativeApp",
  async () => {
    const apiKey = await getChatGPTApiKey();

    if (!apiKey) {
      // User canceled or entered an invalid key, no error message needed
      return;
    }

    const fileName = await getFileNamePrompt();
    const description = await getUserPrompt();
    if (description && fileName) {
      await generateApp(fileName, description, apiKey);
    }
  }
);

