#!/bin/bash


### -----------------------------------------------
### 1️⃣ System Update & Essential Package Installation
### -----------------------------------------------

# Update package lists and upgrade system packages
sudo apt update -y
sudo apt upgrade -y

# Install Git, unzip (required for AWS CLI), and curl
sudo apt install -y git unzip curl


### -----------------------------------------------
### 2️⃣ AWS CLI v2 Check & Installation
### -----------------------------------------------

# Check if AWS CLI v2 is already installed; if not, install it
if ! command -v aws &> /dev/null; then
    echo "Installing AWS CLI v2..."
    cd /tmp
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
fi


### -----------------------------------------------
### 3️⃣ Configure SSH & Deploy Key
### -----------------------------------------------

# Create .ssh directory for the ubuntu user (if missing)
mkdir -p /home/ubuntu/.ssh
chmod 700 /home/ubuntu/.ssh

# Download the deploy SSH key from AWS SSM Parameter Store
aws ssm get-parameter \
  --name "/github/deploy/repo_key" \
  --with-decryption \
  --query "Parameter.Value" \
  --output text \
  > /home/ubuntu/.ssh/id_ed25519

# Secure the SSH key file
chmod 600 /home/ubuntu/.ssh/id_ed25519
chown ubuntu:ubuntu /home/ubuntu/.ssh/id_ed25519

# Add GitHub host key to prevent prompts during git clone
ssh-keyscan github.com >> /home/ubuntu/.ssh/known_hosts
chmod 644 /home/ubuntu/.ssh/known_hosts
chown ubuntu:ubuntu /home/ubuntu/.ssh/known_hosts


### -----------------------------------------------
### 4️⃣ Clone Application Repository
### -----------------------------------------------

# Clone the private GitHub repo into /home/ubuntu/app
sudo -u ubuntu git clone git@github.com:ajithpmohan/user-auth-api.git /home/ubuntu/app

# Navigate into the application folder
cd /home/ubuntu/app


### -----------------------------------------------
### 5️⃣ Load Environment Secrets
### -----------------------------------------------

# Load environment variables into the system
./scripts/load-secrets.sh


### -----------------------------------------------
### 6️⃣ Setup Node.js Environment
### -----------------------------------------------

# Install Node.js via script (assumes script exists in repo)
./scripts/setup-nodejs.sh


### -----------------------------------------------
### 7️⃣ Configure System Services
### -----------------------------------------------

# Create systemd service file for auto start
mkdir -p /home/ubuntu/logs
./scripts/setup-systemd.sh

# Configure and restart Nginx
./scripts/setup-nginx.sh

echo "✔ Setup completed successfully!"
