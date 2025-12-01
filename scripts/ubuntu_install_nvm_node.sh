#!/bin/bash

# Update and upgrade system
sudo apt update -y
sudo apt upgrade -y

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Load NVM into current shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Reload bashrc to ensure NVM works
source ~/.bashrc

# Install Node.js version 24.11.1
nvm install 24.11.1
nvm use 24.11.1

# Set default Node.js version
nvm alias default 24.11.1

# Print versions
echo "NVM version: $(nvm --version)"
echo "Node version: $(node -v)"

echo "Installation completed successfully!"
