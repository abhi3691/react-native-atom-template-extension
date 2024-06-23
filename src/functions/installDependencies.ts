import * as vscode from "vscode";
import * as childProcess from "child_process";

// Function to install project dependencies
export function installDependencies(
  destinationFolder: string,
  progress: vscode.Progress<{ message?: string; increment?: number }>
) {
  // List of dependencies to install
  const dependencies = [
    "@react-native-masked-view/masked-view",
    "@react-navigation/native",
    "@react-navigation/stack",
    "axios",
    "react-native-custom-buttons",
    "react-native-gesture-handler",
    "react-native-paper",
    "react-native-reanimated",
    "react-native-responsive-fontsize",
    "react-native-safe-area-context",
    "react-native-screens",
    "@shopify/flash-list",
    "react-native-svg",
    "react-native-vector-icons",
    "@tanstack/react-query",
  ];

  const devDependencies = [
    "react-native-svg-transformer", // ... other devDependencies
  ];

  try {
    // Install specified dependencies using npm install
    const installDepsCommand = `yarn add ${dependencies.join(" ")}`;
    childProcess.execSync(installDepsCommand, {
      cwd: destinationFolder,
      stdio: "inherit",
    });

    // Install specified devDependencies using npm install
    const installDevDepsCommand = `yarn add  --dev  ${devDependencies.join(
      " "
    )}`;
    childProcess.execSync(installDevDepsCommand, {
      cwd: destinationFolder,
      stdio: "inherit",
    });
  } catch (error: any) {
    // Report progress and show error message
    progress.report({ increment: 100 });
    vscode.window.showErrorMessage(
      `Error installing dependencies: ${(error as Error).message}`
    );
  }
}
