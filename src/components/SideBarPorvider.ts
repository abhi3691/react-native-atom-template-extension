import { json } from 'stream/consumers';
import * as vscode from 'vscode';

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private _extensionUri: vscode.Uri;

  constructor(extensionUri: vscode.Uri) {
    this._extensionUri = extensionUri;
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.command) {
        case 'createProject':
           vscode.commands.executeCommand('react-native-atom-template.createReactNativeProject');
           // Add your logic for creating a React-Native project
           break;
        case 'setupReactNative':
          vscode.commands.executeCommand('react-native-atom-template.setupReactNativeProject');
          // Add your logic for setting up React-Native
           break;
        default:
           // Handle unknown command
           break;
     }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    console.log(this._extensionUri);
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'styles.css')
    );

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <link href="${styleMainUri}" rel="stylesheet">
      </head>
      <body>
          <!-- Render your content here -->
          <p class="info-text">Simplify your React Native project setup with the React Native Atom Template extension for Visual Studio Code.</p>
          <button class="custom-button" onclick="handleCreateProject()">Create React-Native Project</button>
          <button class="custom-button" onclick="handleSetupReactNative()">Setup React-Native</button>

          <script>
          const vscode = acquireVsCodeApi();
          function handleCreateProject() {
              vscode.postMessage({ command: 'createProject' });
          }
      
          function handleSetupReactNative() {
              vscode.postMessage({ command: 'setupReactNative' });
          }
      </script>
      </body>
      </html>`;
  }


}
