#!/bin/bash
# This script sets up NGINX reverse proxy for my Node.js app

echo "=== Installing NGINX ==="
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx

NGINX_FILE="/etc/nginx/sites-available/myapp"

echo "Creating NGINX site..."

sudo tee $NGINX_FILE > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:5000;  # Node.js app port
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/

# Remove default site if it exists
sudo rm -f /etc/nginx/sites-enabled/default

# Test config and restart NGINX
sudo nginx -t
sudo systemctl restart nginx

echo "✅ NGINX reverse proxy configured for 'myapp'."
