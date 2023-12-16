import * as childProcess from "child_process";
import * as vscode from "vscode";
import * as path from "path";
import { checkJavaVersion } from "./checkJavaVersion";
import * as fs from "fs-extra";

export async function runPodInstall(
  destinationFolder: string,
  progress: vscode.Progress<{ message?: string; increment?: number }>
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      const isJavaVersionValid = checkJavaVersion();
      if (isJavaVersionValid) {
        // Replace ios configuration in react-native.config.js
        const configFile = path.join(
          destinationFolder,
          "react-native.config.js"
        );
        const configContents = fs.readFileSync(configFile, "utf-8");
        const updatedConfigContents = configContents.replace(
          /ios:\s*{[\s\S]*?},/,
          "ios: {},"
        );
        fs.writeFileSync(configFile, updatedConfigContents, "utf-8");
      }
      // Set the LANG environment variable
      process.env.LANG = "en_US.UTF-8";

      const podInstallCommand = "npx pod-install";
      const options = { cwd: destinationFolder };

      const child = childProcess.exec(podInstallCommand, options);

      // child.stdout?.on("data", (data) => {
      //   console.log(data.toString());
      // });

      // child.stderr?.on("data", (data) => {
      //   console.error(data.toString());
      // });

      child.on("exit", (code) => {
        if (code === 0) {
          // Success
          progress.report({ increment: 80 });
          resolve();
        } else {
          // Error
          reject(new Error(`Command failed with exit code ${code}`));
        }
      });
    } catch (error: any) {
      console.error("Error running pod install:", error.message);
      reject(error);
    }
  });
}
