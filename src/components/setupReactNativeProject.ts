import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import { setupMAcScript } from '../script/mac/setup';

export const setupDisposable = vscode.commands.registerCommand('react-native-atom-template.setupReactNativeProject', async () => {
    try {
        const isMac = process.platform === 'darwin';

        if (isMac) {
            // Open the terminal and guide the user through the setup steps

            // Create a temporary setup script file
            const setupScriptPath = `${os.tmpdir()}/react_native_setup.sh`;
            const setupScriptContent = setupMAcScript;

            fs.writeFileSync(setupScriptPath, setupScriptContent);

            // Open the integrated terminal and run the setup script
            const terminal = vscode.window.createTerminal({
                name: 'React Native Setup',
                cwd: vscode.workspace.rootPath || undefined,
            });

            terminal.sendText(`bash ${setupScriptPath}`);

            // Focus on the terminal after opening
            terminal.show(true);
        } else {
            vscode.window.showErrorMessage('This command is only supported on macOS.');
        }
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error setting up React Native project: ${error.message}`);
    }
});
