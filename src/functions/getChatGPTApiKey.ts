import * as vscode from "vscode";
const API_KEY_CONFIG_KEY = "react-native-atom-template.apiKey";
const pattern: RegExp = /^sk-[A-Za-z0-9-_]{24,}$/;
const API_MODEL_CONFIG_KEY = "react-native-atom-template.apiModel";

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
export async function getApiModel(): Promise<string | undefined> {
  // Retrieve the API model from the configuration
  const storedApiModel = vscode.workspace
    .getConfiguration()
    .get(API_MODEL_CONFIG_KEY) as string | undefined;

  if (storedApiModel) {
    return storedApiModel;
  }

  // If not present, prompt the user to select a model
  const apiModel = await vscode.window.showQuickPick(
    ["gpt-3.5-turbo", "gpt-4-turbo", "gpt-3.5-turbo-0301", "gpt-4-turbo-0301"],
    {
      placeHolder: "Select the ChatGPT model",
      canPickMany: false,
      ignoreFocusOut: true,
    }
  );

  // Check if the user canceled the selection
  if (apiModel === undefined) {
    return undefined;
  }

  // Update the configuration with the selected model
  await vscode.workspace
    .getConfiguration()
    .update(API_MODEL_CONFIG_KEY, apiModel, vscode.ConfigurationTarget.Global);

  return apiModel;
}

function isValidOpenaiApiKey(apiKey: string): boolean {
  const trimmedKey = apiKey.trim();
  return pattern.test(trimmedKey);
}
