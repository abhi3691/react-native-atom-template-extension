import * as ChildProcess from "child_process";
import * as vscode from "vscode";

// Function to check the Java version
export function checkJavaVersion() {
  try {
    // const javaVersionOutput =
    //   ChildProcess.execSync("java --version").toString();

    // windows java version check result
    const javaVersionOutput = `java --version
    java 11.0.13 2021-10-19 LTS
    Java(TM) SE Runtime Environment 18.9 (build 11.0.13+10-LTS-370)
    Java HotSpot(TM) 64-Bit Server VM 18.9 (build 11.0.13+10-LTS-370, mixed mode)`;
    const javaVersionMatch = javaVersionOutput.match(
      /(\d+(\.\d+)+) \d{4}-\d{2}-\d{2}/
    );

    if (!javaVersionMatch) {
      vscode.window.showErrorMessage("Unable to determine Java version.");
      return false;
    }

    const javaVersion = parseFloat(javaVersionMatch[1]);
    return javaVersion >= 17;
  } catch (error: any) {
    vscode.window.showErrorMessage(
      "Error checking Java version: " + error.message
    );
    return false;
  }
}
