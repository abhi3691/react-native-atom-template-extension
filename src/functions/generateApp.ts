import * as vscode from "vscode";
import axios from "axios";
import path from "path";
import fs from "fs";
import { openAndFormatFile } from "./openAndFormatFile";

export async function generateApp(
  fileName: string,
  description: string,
  apiKey: string,
  model: string
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
        cancellable: false,
      },
      async (progress, token) => {
        progress.report({ increment: 0, message: "Initializing..." });

        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: `${model}`,
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant that generates code.",
              },
              {
                role: "user",
                content: `Create a ${description} React Native component using TypeScript. Format the code to ensure it integrates smoothly with an existing project.`,
              },
            ],
            max_tokens: 500,
            temperature: 0.6,
          },
          config
        );

        const responseData = response.data.choices[0].message.content;
        const generatedComponentCode = responseData;

        progress.report({ increment: 50, message: "Writing to file..." });

        const projectRoot = vscode.workspace.workspaceFolders;
        if (projectRoot && projectRoot.length > 0) {
          const fileNameParts = fileName.split("/");
          const file = fileNameParts.pop() as string;
          const directoryPath = path.join(
            projectRoot[0]?.uri?.fsPath,
            "src",
            ...fileNameParts
          );
          const filePath = path.join(directoryPath, `${file}.tsx`);

          await fs.promises.mkdir(directoryPath, { recursive: true });
          fs.writeFileSync(filePath, generatedComponentCode.trim());
        } else {
          vscode.window.showErrorMessage(
            "Unable to determine project root. Please open a React Native project."
          );
          return;
        }

        progress.report({ increment: 100, message: "Generation complete!" });
        openAndFormatFile(`${fileName}.tsx`);
      }
    );
  } catch (error: any) {
    let errorMessage = "Failed to generate component.";

    if (error.response) {
      if (
        error.response.data &&
        error.response.data.error &&
        error.response.data.error.message
      ) {
        errorMessage = error.response.data.error.message;
      } else {
        switch (error.response.status) {
          case 401:
            errorMessage =
              "API key is invalid or has expired. Please check your API key.";
            break;
          case 402:
            errorMessage =
              "Insufficient credits. Please check your OpenAI account.";
            break;
          case 429:
            errorMessage =
              "Rate limit exceeded or quota exhausted. Please try again later.";
            break;
          default:
            errorMessage = errorMessage;
            break;
        }
      }
    } else if (error.request) {
      errorMessage =
        "No response received from the server. Please check your network connection.";
    } else {
      errorMessage = error.message;
    }

    vscode.window.showErrorMessage(errorMessage);
  }
}
