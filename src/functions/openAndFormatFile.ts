import * as vscode from "vscode";
import path from "path";

export async function openAndFormatFile(fileName: string): Promise<void> {
  const projectRoot = vscode.workspace.workspaceFolders;

  if (projectRoot && projectRoot.length > 0) {
    const filePath = path.join(
      projectRoot[0].uri.fsPath || "",
      "src",
      fileName
    );

    try {
      const document = await vscode.workspace.openTextDocument(filePath);
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
      console.error("Error opening or formatting file:", error);
      vscode.window.showErrorMessage(`Failed to format file. ${error}`);
    }
  }
}
