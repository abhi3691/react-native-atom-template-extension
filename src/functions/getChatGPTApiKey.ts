import * as vscode from "vscode";
const API_KEY_CONFIG_KEY = "react-native-atom-template.apiKey";
const pattern: RegExp = /^sk-[A-Za-z0-9]{28,}$/;

export async function getChatGPTApiKey(): Promise<string | undefined> {
    // Check if the API key is already present in the configuration
    const storedApiKey = vscode.workspace
      .getConfiguration()
      .get(API_KEY_CONFIG_KEY) as string | undefined;
  
    if (storedApiKey && isValidOpenaiApiKey(storedApiKey)) {
      return storedApiKey;
    }
  
    // If not present or invalid, prompt the user
    const apiKey = await vscode.window.showInputBox({
      prompt: "Enter your ChatGPT API key",
      value: storedApiKey,
    });
  
    // Check if the user canceled the input
    if (apiKey === undefined) {
      return undefined;
    }
  
    if (apiKey && isValidOpenaiApiKey(apiKey)) {
      // Update the configuration with the entered API key
      await vscode.workspace
        .getConfiguration()
        .update(API_KEY_CONFIG_KEY, apiKey, vscode.ConfigurationTarget.Global);
      return apiKey;
    } else {
      // If the input is invalid (not canceled), show an error message
      vscode.window.showErrorMessage("Invalid ChatGPT API key format.");
      return undefined;
    }
  }
  

  function isValidOpenaiApiKey(apiKey: string): boolean {
    const trimmedKey = apiKey.trim();
    return pattern.test(trimmedKey);
  }
  
  