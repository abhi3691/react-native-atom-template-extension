export const setupMACScript =`#!/bin/bash

# Install Xcode Command Line Tools
xcode-select --install

# Install Homebrew (if not installed)
if ! command -v brew &> /dev/null; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install Xcode from the App Store (manual step)
# Print message to guide the user to install Xcode from the App Store
echo "Please open the App Store and search for Xcode. Once you find it, click on the 'Get' button to start the installation. You can also use the following link to open Xcode in the App Store:"
open "macappstore://apps.apple.com/us/app/xcode/id497799835"

# Wait for the user to install Xcode manually
read -p "Press Enter after you have installed Xcode."

# Add Homebrew's executable directory to the front of the PATH
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc

# Check if Homebrew is installed
brew doctor

# Install Node and Watchman using Homebrew
brew install node
brew install watchman

# Tap homebrew/cask-versions and install Zulu 11
brew tap homebrew/cask-versions
brew install --cask zulu11

# Get path to where cask was installed to double-click installer
brew info --cask zulu11


# Wait for the user to install Android Studio manually
read -p "Press Enter after you have installed Android Studio and setup emulator and SDK."

# Download and install Android Studio (manual step)
# Add the following lines to ~/.zshrc
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc

# Install CocoaPods
sudo gem install cocoapods


# Check versions
echo "Node.js version: $(node -v)"
echo "Gem version: $(gem -v)"
echo "Ruby version: $(ruby -v)"
echo "Watchman version: $(watchman -v)"
echo "Zulu JDK 11 version: $(brew info --cask zulu11 | grep Version | awk '{print $2}')"
echo "Android Studio version: (Please check manually)"
echo "CocoaPods version: $(pod --version)"
echo "Xcode version: $(xcodebuild -version | grep Xcode)"
`;