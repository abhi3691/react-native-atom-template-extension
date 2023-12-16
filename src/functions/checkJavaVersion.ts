import * as ChildProcess from "child_process";
import * as vscode from "vscode";

// Function to check the Java version
export function checkJavaVersion() {
  try {
    const javaVersionOutput =
      ChildProcess.execSync("java --version").toString();
    const javaVersionMatch = javaVersionOutput.match(
      /openjdk (\d+\.\d+(\.\d+)?) \d{4}-\d{2}-\d{2} /
    );

    if (!javaVersionMatch) {
      vscode.window.showErrorMessage("Unable to determine Java version.");
      return false;
    }

    const javaVersion = parseFloat(javaVersionMatch[1]);
    console.log(javaVersion);
    return javaVersion >= 17;
  } catch (error: any) {
    vscode.window.showErrorMessage(
      "Error checking Java version: " + error.message
    );
    return false;
  }
}
