import * as path from "path";
import * as fs from "fs";
import { createWorkspaceEdit } from "./createWorkspaceEdit";
import * as vscode from "vscode";
import { toCamelCase } from "./toCamelCase";
import { openAndFormatFile } from "./openAndFormatFile";

export async function createFiles(folderPath: string, folderName: string) {
  const camelCaseFolderName = toCamelCase(folderName);

  // Create the folder
  const folderFullPath = path.join(folderPath, folderName);
  fs.mkdirSync(folderFullPath);

  // Create index.tsx
  const indexPath = path.join(folderFullPath, "index.tsx");
  const indexContent = `
  import { View, Text } from 'react-native';
  import React from 'react';
  const ${camelCaseFolderName} = () => {
    return (
      <View>
        <Text>${camelCaseFolderName}</Text>
      </View>
    );
  };
  
  export default ${camelCaseFolderName};
    `;
  fs.writeFileSync(indexPath, indexContent);

  // Create styles.ts
  const stylesPath = path.join(folderFullPath, "styles.ts");
  const stylesContent = `
  import { StyleSheet } from 'react-native';
  
  const styles = StyleSheet.create({});
  
  export default styles;
    `;
  fs.writeFileSync(stylesPath, stylesContent);

  try {
    const document = await vscode.workspace.openTextDocument(indexPath);

    await vscode.commands.executeCommand("editor.action.formatDocument");
    const editor = await vscode.window.showTextDocument(document);

    // Perform formatting
    await editor.edit((editBuilder) => {
      const fullRange = new vscode.Range(
        editor.document.positionAt(0),
        editor.document.positionAt(editor.document.getText().length)
      );
      editBuilder.replace(fullRange, editor.document.getText());
    });
    await document.save();
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to format file. ${error}`);
  }

  try {
    const document = await vscode.workspace.openTextDocument(stylesPath);
    const editor = await vscode.window.showTextDocument(document);

    // Perform formatting
    await editor.edit((editBuilder) => {
      const fullRange = new vscode.Range(
        editor.document.positionAt(0),
        editor.document.positionAt(editor.document.getText().length)
      );
      editBuilder.replace(fullRange, editor.document.getText());
    });
    await vscode.commands.executeCommand("editor.action.formatDocument");
    await document.save();
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to format file. ${error}`);
  }

  vscode.window.showInformationMessage(
    `Component folder "${folderName}" created.`
  );
}
