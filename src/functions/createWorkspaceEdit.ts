import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function createWorkspaceEdit(folderPath: string): vscode.WorkspaceEdit {
  const edit = new vscode.WorkspaceEdit();

  // Index.tsx
  const indexPath = path.join(folderPath, "index.tsx");
  const indexDocument = vscode.Uri.file(indexPath);
  const indexText = fs.readFileSync(indexPath, "utf-8");
  const indexEdit = new vscode.TextEdit(
    new vscode.Range(0, 0, indexText.split("\n").length, 0),
    indexText
  );
  edit.set(indexDocument, [indexEdit]);

  // Styles.ts
  const stylesPath = path.join(folderPath, "styles.ts");
  const stylesDocument = vscode.Uri.file(stylesPath);
  const stylesText = fs.readFileSync(stylesPath, "utf-8");
  const stylesEdit = new vscode.TextEdit(
    new vscode.Range(0, 0, stylesText.split("\n").length, 0),
    stylesText
  );
  edit.set(stylesDocument, [stylesEdit]);

  return edit;
}
