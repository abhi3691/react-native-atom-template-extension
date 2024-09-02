import * as ChildProcess from "child_process";
import * as vscode from "vscode";

// Function to check the Java version
export function checkJavaVersion() {
  try {
    const javaVersionOutput =
      ChildProcess.execSync("javac --version").toString();

    // Regular expression to capture the Java version number
    const javaVersionMatch = javaVersionOutput.match(/javac (\d+(\.\d+)+)/);

    if (!javaVersionMatch) {
      vscode.window.showErrorMessage("Unable to determine Java version.");
      return false;
    }
    console.log("javaVersion", javaVersionOutput);

    const javaVersion = parseFloat(javaVersionMatch[1]);
    return javaVersion >= 17.0;
  } catch (error: any) {
    vscode.window.showErrorMessage(
      "Error checking Java version: " + error.message
    );
    return false;
  }
}
