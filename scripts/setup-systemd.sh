#!/bin/bash
# This script sets up the systemd service for my Node.js app

SERVICE_FILE="/etc/systemd/system/myapp.service"

echo "Creating systemd service..."

sudo tee $SERVICE_FILE > /dev/null <<EOF
[Unit]
Description=My Node App
After=network.target

[Service]
Type=simple
User=ubuntu
Environment=HOME=/home/ubuntu
WorkingDirectory=/home/ubuntu/user-auth-api
ExecStart=/home/ubuntu/.nvm/versions/node/v24.11.1/bin/node src/app.js
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable myapp
sudo systemctl restart myapp

echo "✅ systemd service 'myapp' created and started."
