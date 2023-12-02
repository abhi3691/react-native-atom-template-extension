import * as vscode from "vscode";
import axios from "axios";
import fs from "fs";
import path from "path";
const API_KEY_CONFIG_KEY = "react-native-atom-template.apiKey";
const pattern: RegExp = /^sk-[A-Za-z0-9]{28,}$/;

function getUserPrompt(): Thenable<string | undefined> {
  return vscode.window.showInputBox({
    prompt: "Describe your React Native Component:",
  });
}
function getFileNamePrompt(): Thenable<string | undefined> {
  return vscode.window.showInputBox({
    prompt: "Enter the file name:",
    placeHolder: "Enter react native componts name",
  });
}

async function getChatGPTApiKey(): Promise<string | undefined> {
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

async function generateApp(
  fileName: string,
  description: string,
  apiKey: string
): Promise<void> {
  const config = {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  };

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Generating React Native Component",
        cancellable: false, // Set to true if you want to allow cancellation
      },
      async (progress, token) => {
        // Update progress here
        progress.report({ increment: 0, message: "Initializing..." });

        const response = await axios.post(
          "https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions",
          {
            prompt: `Create a ${description} React Native component using TypeScript. Format the code to ensure it integrates smoothly with an existing project.`,
            max_tokens: 500,
            temperature: 0.6,
          },
          config
        );

        const responseData = response.data.choices[0].text;
        const todayLink = responseData;

        progress.report({ increment: 50, message: "Writing to file..." });

        // Write the generated content to a file in your React Native project
        const projectRoot = vscode.workspace.workspaceFolders;
        if (projectRoot && projectRoot.length >0) {
          const fileNameParts = fileName.split("/");
          const file = fileNameParts.pop() as string;
          const directoryPath = path.join(projectRoot[0]?.uri?.fsPath,"src", ...fileNameParts);
          const filePath = path.join(directoryPath, `${file}.tsx`);

          // Create directories if they don't exist
          await fs.promises.mkdir(directoryPath, { recursive: true });
          fs.writeFileSync(filePath, todayLink.trim());
        } else {
          vscode.window.showErrorMessage(
            "Unable to determine project root. Please open a React Native project."
          );
          return;
        }

        progress.report({ increment: 100, message: "Generation complete!" });
        // Open the file and format it
        openAndFormatFile(`${fileName}.tsx`);
      }
    );
  } catch (error: any) {
    let errorMessage = error;
    console.error("Error generating link:", errorMessage);
    vscode.window.showErrorMessage(`Failed to generate link. ${errorMessage}`);
  }
}

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

function isValidOpenaiApiKey(apiKey: string): boolean {
  const trimmedKey = apiKey.trim();
  return pattern.test(trimmedKey);
}

async function openAndFormatFile(fileName: string): Promise<void> {
  const filePath = path.join(vscode.workspace.rootPath || "", "src", fileName);

  try {
    const document = await vscode.workspace.openTextDocument(filePath);
    const editor = await vscode.window.showTextDocument(document);

    await vscode.commands.executeCommand("editor.action.formatDocument");
    await document.save();
  } catch (error) {
    console.error("Error opening or formatting file:", error);
    vscode.window.showErrorMessage(`Failed to format file. ${error}`);
  }
}
