import * as vscode from "vscode";
import * as childProcess from "child_process";

// Function to install bundler
export async function installBundler(
  destinationFolder: string,
  progress: vscode.Progress<{ message?: string; increment?: number }>
) {
  try {
    // Install bundler
    const bundlerInstallCommand = "gem install bundler";
    childProcess.execSync(bundlerInstallCommand, {
      cwd: destinationFolder,
      stdio: "inherit",
    });

    // Report progress
    progress.report({ increment: 50 });
  } catch (error: any) {
    // Report progress and show error message
    progress.report({ increment: 100 });
    vscode.window.showErrorMessage(
      `Error installing bundler: ${(error as Error).message}`
    );
  }
}
