#!/bin/bash
# This script sets up the systemd service for my Node.js app

SERVICE_FILE="/etc/systemd/system/myapp.service"

echo "Creating systemd service..."

sudo tee $SERVICE_FILE > /dev/null <<EOF
[Unit]
Description=My Node.js Application
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ubuntu
Group=ubuntu
Environment=HOME=/home/ubuntu
WorkingDirectory=/home/ubuntu/app

# --- Load NVM and ensure correct Node version ---
ExecStartPre=/bin/bash -c 'source /home/ubuntu/.nvm/nvm.sh'


# --- Required for EC2 IMDSv2 Token Fetch (IAM Role credentials) ---
# AWS SDK automatically retrieves temporary credentials from EC2 IMDS.
Environment=AWS_EC2_METADATA_SERVICE_ENDPOINT=http://169.254.169.254
Environment=AWS_EC2_METADATA_DISABLED=false
CapabilityBoundingSet=CAP_NET_RAW
AmbientCapabilities=CAP_NET_RAW

# --- Start Application ---
ExecStart=/home/ubuntu/.nvm/versions/node/v24.11.1/bin/node src/app.js

# --- Restart Policy ---
Restart=always
RestartSec=5

# --- Logging ---
StandardOutput=append:/home/ubuntu/logs/access.log
StandardError=append:/home/ubuntu/logs/error.log

# --- Resource Limits (Recommended) ---
NoNewPrivileges=true
LimitNOFILE=50000

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable myapp
sudo systemctl restart myapp

echo "✅ systemd service 'myapp' created and started."
