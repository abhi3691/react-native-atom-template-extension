import * as vscode from "vscode";
import * as childProcess from "child_process";
import * as path from "path";
import * as AdmZip from "adm-zip";
import * as fs from "fs-extra";
import * as os from "os";

import { installDependencies } from "./installDependencies";
import { runBundleInstall } from "./runBundleInstall";
import { runPodInstall } from "./runPodInstall";
import { addFontsToInfoPlist } from "./addFontsToInfoPlist";
import { checkJavaVersion } from "./checkJavaVersion";

interface props {
  progressOptions: vscode.ProgressOptions;
  selectedFolder: string;
  projectName: string;
  destinationFolder: string;
  command: string;
}

export const ProjecrCreation = async ({
  progressOptions,
  selectedFolder,
  projectName,
  destinationFolder,
  command,
}: props) => {
  // Execute the project creation within a progress window
  await vscode.window.withProgress(progressOptions, async (progress) => {
    try {
      // Command to create a new React Native project
      childProcess.execSync(command, {
        cwd: selectedFolder,
        stdio: "inherit",
      });

      // Path to the template zip file
      const zipFilePath = path.join(__dirname, "..", "data", "template.zip");

      // Extract the template to the destination folder
      const zip = new AdmZip.default(zipFilePath);
      zip.extractAllTo(destinationFolder, true);

      // Add apply from line to android/app/build.gradle
      const buildGradlePath = path.join(
        destinationFolder,
        "android",
        "app",
        "build.gradle"
      );
      const buildGradleContent = fs.readFileSync(buildGradlePath, "utf-8");
      const updatedBuildGradleContent = `${buildGradleContent}\napply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")\n`;
      fs.writeFileSync(buildGradlePath, updatedBuildGradleContent, "utf-8");

      // Install dependencies using npm install
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Installing dependencies",
        },
        async (progress) => {
          installDependencies(destinationFolder, progress);
        }
      );

      // Run "bundle install" if on macOS and bundle is found
      if (os.platform() === "darwin") {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Running bundle install",
          },
          async (progress) => {
            await runBundleInstall(destinationFolder, progress);
          }
        );
        // Run "Pod install" if on macOS

        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Running pod install",
          },
          async (progress) => {
            await runPodInstall(destinationFolder, progress);
          }
        );
        const iosInfoPlistPath = path.join(
          destinationFolder,
          "ios",
          projectName,
          "Info.plist"
        );
        // Add fonts to iOS/info.plist
        addFontsToInfoPlist(iosInfoPlistPath);
      }

      // Report progress and show success message
      progress.report({ increment: 100 });
      vscode.window.showInformationMessage(
        `React Native project '${projectName}' created successfully in ${selectedFolder}`
      );
    } catch (error: any) {
      // Report progress and show error message
      progress.report({ increment: 100 });
      vscode.window.showErrorMessage(
        `Error creating React Native project: ${error.message}`
      );
      return;
    }
  });
  // Open the created project folder in VS Code
  const projectFolder = path.join(selectedFolder, projectName);
  vscode.commands.executeCommand(
    "vscode.openFolder",
    vscode.Uri.file(projectFolder),
    true
  );
};
