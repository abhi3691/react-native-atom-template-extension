import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import { setupMACScript } from '../script/mac/setup';
import { setupLinuxScript } from '../script/linux/setup';
import { setupWindowsScript } from '../script/windows/setup';

export const setupDisposable = vscode.commands.registerCommand('react-native-atom-template.setupReactNativeProject', async () => {
    try {
        const isMac = process.platform === 'darwin';
        const isLinux = process.platform === 'linux';
        const isWindows = process.platform === 'win32';

        if (isMac) {
            // Open the terminal and guide the user through the setup steps

            // Create a temporary setup script file
            const setupScriptPath = `${os.tmpdir()}/react_native_setup.sh`;
            const setupScriptContent = setupMACScript;

            fs.writeFileSync(setupScriptPath, setupScriptContent);

            // Open the integrated terminal and run the setup script
            const terminal = vscode.window.createTerminal({
                name: 'React Native Setup',
                cwd: vscode.workspace.rootPath || undefined,
            });

            terminal.sendText(`bash ${setupScriptPath}`);

            // Focus on the terminal after opening
            terminal.show(true);
        } else if (isLinux) {
            // Placeholder for Linux setup
            const setupScriptPath = `${os.tmpdir()}/react_native_setup_linux.sh`;
            const setupScriptContent = setupLinuxScript;

            fs.writeFileSync(setupScriptPath, setupScriptContent);

            // Open the integrated terminal and run the setup script
            const terminal = vscode.window.createTerminal({
                name: 'React Native Setup',
                cwd: vscode.workspace.rootPath || undefined,
            });

            terminal.sendText(`bash ${setupScriptPath}`);
            terminal.show(true);
        } else if (isWindows) {
            // Placeholder for Windows setup
            const setupScriptPath = `${os.tmpdir()}/react_native_setup_windows.ps1`;
            const setupScriptContent = setupWindowsScript;

            fs.writeFileSync(setupScriptPath, setupScriptContent);

            // Open the integrated terminal and run the setup script
            const terminal = vscode.window.createTerminal({
                name: 'React Native Setup',
                cwd: vscode.workspace.rootPath || undefined,
            });

            terminal.sendText(`powershell ${setupScriptPath}`);
            terminal.show(true);
        } else {
            vscode.window.showErrorMessage('This command is only supported on macOS | Linux | Windows');
        }
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error setting up React Native project: ${error.message}`);
    }
});
