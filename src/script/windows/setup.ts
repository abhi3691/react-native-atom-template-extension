export const setupWindowsScript =`#!/bin/bash

# Check the current execution policy
$executionPolicy = Get-ExecutionPolicy

# Set execution policy to Bypass if it's Restricted
if ($executionPolicy -eq "Restricted") {
    Set-ExecutionPolicy Bypass -Scope Process -Force
}

# Install Chocolatey (if not installed)
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
}

# Install Node.js, Yarn, Git, and Microsoft OpenJDK 11 using Chocolatey
choco install -y nodejs.install yarn git microsoft-openjdk11 

# Wait for the user to install Android Studio manually
read -p "Press Enter after you have installed Android Studio and setup emulator and SDK."

# Download and install Android Studio 
choco install -y androidstudio

# Print message to guide the user to configure Android Studio
Write-Host "Please follow these steps to configure Android Studio:"
Write-Host "1. Open Android Studio and check the following items during installation:"
Write-Host "   - Android SDK"
Write-Host "   - Android SDK Platform"
Write-Host "   - Android Virtual Device"
Write-Host "2. If you are not using Hyper-V, make sure to install 'Performance (Intel HAXM)' (See here for AMD or Hyper-V)"
Write-Host "3. Open the SDK Manager in Android Studio, select the 'SDK Platforms' tab, check 'Show Package Details', and make sure the following are checked:"
Write-Host "   - Android SDK Platform 33"
Write-Host "   - Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image"
Write-Host "4. Configure the ANDROID_HOME environment variable to %LOCALAPPDATA%\Android\Sdk"
Write-Host "5. Add the platform-tools path (%LOCALAPPDATA%\Android\Sdk\platform-tools) to the Path environment variable."

# Wait for the user to configure Android Studio manually
Read-Host "Press Enter after you have configured Android Studio and set up the SDK."

# Configure the ANDROID_HOME environment variable
[Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", [System.EnvironmentVariableTarget]::User)

# Add platform-tools to Path
$platformToolsPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools"
[Environment]::SetEnvironmentVariable('Path', "$env:Path;$platformToolsPath", [System.EnvironmentVariableTarget]::User)

# Check versions
Write-Host "Node.js version: $(node -v)"
Write-Host "Yarn version: $(yarn -v)"
Write-Host "Git version: $(git --version)"
Write-Host "Java JDK 11 version: $(java -version 2>&1 | findstr /I 'version')"
Write-Host "Android Studio version: (Please check manually)"

`;