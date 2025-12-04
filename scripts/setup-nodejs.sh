#!/bin/bash

sudo -u ubuntu bash << 'EOF'

# Ensure correct HOME for ubuntu user
export HOME="/home/ubuntu"
export NVM_DIR="$HOME/.nvm"

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Configure NVM for future shells
echo 'export NVM_DIR="$HOME/.nvm"' >> "$HOME/.bashrc"
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> "$HOME/.bashrc"
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> "$HOME/.bashrc"

# Load NVM NOW for this script
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"

# Reload bashrc
source "$HOME/.bashrc"

# Install Node.js and set default
nvm install 24.11.1
nvm use 24.11.1
nvm alias default 24.11.1

# Fix ownership — prevent future permission denied
chown -R ubuntu:ubuntu "$NVM_DIR"

# Print version info
echo "NVM version: \$(nvm --version)"
echo "Node version: \$(node -v)"

# Install required NPM packages
cd /home/ubuntu/app
npm install

echo "Installation completed successfully!"

EOF
