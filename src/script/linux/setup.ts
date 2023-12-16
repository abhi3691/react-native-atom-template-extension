export const setupLinuxScript =`#!/bin/bash

# #!/bin/bash

# Install Node.js (Version 16 or newer)
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install OpenJDK 17
sudo apt-get install -y openjdk-17-jdk

# Wait for the user to install Android Studio manually
read -p "Press Enter after you have installed Android Studio and setup emulator and SDK."

# Download and install Android Studio (manual step)

# Print instructions for Android Studio setup
echo "Please follow these steps to configure Android Studio:"
echo "1. Open Android Studio and check the following items during installation:"
echo "   - Android SDK"
echo "   - Android SDK Platform"
echo "   - Android Virtual Device"
echo "2. Open the SDK Manager in Android Studio, select the 'SDK Platforms' tab, check 'Show Package Details', and make sure the following are checked:"
echo "   - Android SDK Platform 33"
echo "   - Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image"
echo "3. Configure the ANDROID_HOME environment variable by adding the following lines to your shell profile file (e.g., ~/.bashrc or ~/.zshrc):"
echo "   export ANDROID_HOME=$HOME/Android/Sdk"
echo "   export PATH=$PATH:$ANDROID_HOME/emulator"
echo "   export PATH=$PATH:$ANDROID_HOME/platform-tools"
echo "4. Source your shell profile file to apply changes:"
echo "   source ~/.bashrc # For bash"
echo "   source ~/.zshrc # For zsh"
echo "5. Verify that ANDROID_HOME has been set by running 'echo \$ANDROID_HOME' and check the appropriate directories have been added to your path by running 'echo \$PATH'."

# Install Watchman (follow Watchman installation guide)
# For example, you can compile and install from source:
git clone https://github.com/facebook/watchman.git
cd watchman
git checkout v2022.01.24.00 # Use the latest stable release
sudo apt-get install -y autoconf automake build-essential python3-dev libssl-dev libtool
./autogen.sh
./configure
make
sudo make install

# Print completion message
echo "Installation complete. Make sure to restart your terminal or run 'source ~/.bashrc' (or 'source ~/.zshrc' for zsh) to apply environment variable changes."

`;