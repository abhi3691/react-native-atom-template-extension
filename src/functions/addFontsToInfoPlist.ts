import { execSync } from "child_process";
import * as fs from "fs-extra";
import * as vscode from "vscode";

// Function to add fonts to iOS/info.plist
export function addFontsToInfoPlist(infoPlistPath: string) {
  const fontArray = [
    "AntDesign.ttf",
    "Entypo.ttf",
    "EvilIcons.ttf",
    "Feather.ttf",
    "FontAwesome.ttf",
    "FontAwesome5_Brands.ttf",
    "FontAwesome5_Regular.ttf",
    "FontAwesome5_Solid.ttf",
    "FontAwesome6_Brands.ttf",
    "FontAwesome6_Regular.ttf",
    "FontAwesome6_Solid.ttf",
    "Foundation.ttf",
    "Ionicons.ttf",
    "MaterialIcons.ttf",
    "MaterialCommunityIcons.ttf",
    "SimpleLineIcons.ttf",
    "Octicons.ttf",
    "Zocial.ttf",
    "Fontisto.ttf",
  ];
  try {
    const infoPlistContent = fs.readFileSync(infoPlistPath, "utf-8");

    // Find the position before the last </dict>
    const position = infoPlistContent.lastIndexOf("</dict>");

    if (position === -1) {
      throw new Error("Invalid info.plist format");
    }

    // Split the content into two parts
    const beforeLastDict = infoPlistContent.substring(0, position);
    const afterLastDict = infoPlistContent.substring(position);

    // Create the font string
    const fontString = fontArray
      .map((fontName) => `<string>${fontName}</string>`)
      .join("\n");

    // Combine the parts with the font array
    const updatedInfoPlistContent = `${beforeLastDict}\n<key>UIAppFonts</key>\n<array>\n${fontString}\n</array>\n${afterLastDict}`;
    // Write the updated content back to the file
    fs.writeFileSync(infoPlistPath, updatedInfoPlistContent, "utf-8");
  } catch (error: any) {
    vscode.window.showErrorMessage(
      `Error installing bundler: ${(error as Error).message}`
    );
  }
}
