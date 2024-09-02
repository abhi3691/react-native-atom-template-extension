import * as vscode from "vscode";
import axios from "axios";
import path from "path";
import fs from "fs";
import { openAndFormatFile } from "./openAndFormatFile";

export async function generateApp(
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
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4-turbo",
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

        // Write the generated content to a file in your React Native project
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

          // Create directories if they don't exist
          await fs.promises.mkdir(directoryPath, { recursive: true });
          fs.writeFileSync(filePath, generatedComponentCode.trim());
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
    vscode.window.showErrorMessage(
      `Failed to generate component. ${errorMessage}`
    );
  }
}
