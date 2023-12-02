import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import * as path from 'path';

export const disposable = vscode.commands.registerCommand('react-native-atom-template.createReactNativeProject', async () => {
    const folderUri = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: 'Open',
    });

    if (!folderUri || folderUri.length === 0) {
        vscode.window.showErrorMessage('No folder selected. Please select a folder to create the project.');
        return;
    }

    const selectedFolder = folderUri[0].fsPath;

    const projectName = await vscode.window.showInputBox({
        prompt: 'Enter the name for your React Native project',
        ignoreFocusOut: true,
    });

    if (!projectName) {
        vscode.window.showErrorMessage('Project name is required. Please enter a valid name.');
        return;
    }

    const progressOptions: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: `Creating React Native project '${projectName}'`,
    };

    await vscode.window.withProgress(progressOptions, async (progress) => {
        try {
            const command = `npx react-native init ${projectName} --template react-native-atom-template --skip-install`;
            childProcess.execSync(command, { cwd: selectedFolder, stdio: 'inherit' });

            progress.report({ increment: 100 });
            vscode.window.showInformationMessage(`React Native project '${projectName}' created successfully in ${selectedFolder}`);
        } catch (error: any) {
            progress.report({ increment: 100 });
            vscode.window.showErrorMessage(`Error creating React Native project: ${error.message}`);
        }
    });

    // Open the created project folder in VS Code
    const projectFolder = path.join(selectedFolder, projectName);
    vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(projectFolder), true);
});



