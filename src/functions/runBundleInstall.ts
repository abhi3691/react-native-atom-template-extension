import * as vscode from "vscode";
import * as childProcess from "child_process";
import { installBundler } from "./installBundler";

// Function to run "bundle install" on macOS
export async function runBundleInstall(
  destinationFolder: string,
  progress: vscode.Progress<{ message?: string; increment?: number }>
) {
  try {
    // Check the version of the "bundle" command
    const bundleCheckCommand = "bundle --version";
    const bundleCheckResult = childProcess.execSync(bundleCheckCommand, {
      cwd: destinationFolder,
      encoding: "utf8",
      stdio: "pipe",
    });

    // Extract the version number from the result
    const bundleVersionMatch = /Bundler version (\d+\.\d+\.\d+)/.exec(
      bundleCheckResult
    );
    const bundleVersion = bundleVersionMatch
      ? bundleVersionMatch[1]
      : undefined;

    if (!bundleVersion) {
      // If version is not found, install bundler
      await installBundler(destinationFolder, progress);
    }

    // Run "bundle install"
    const bundleInstallCommand = "bundle install";
    childProcess.execSync(bundleInstallCommand, {
      cwd: destinationFolder,
      stdio: "inherit",
    });

    // Report progress
    progress.report({ increment: 100 });
  } catch (error: any) {
    console.log("error", error);
    // Report progress and show error message
    progress.report({ increment: 100 });
    vscode.window.showErrorMessage(
      `Error running bundle install: ${(error as Error).message}`
    );
  }
}
