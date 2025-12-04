#!/bin/bash

SECRET_NAME="/dev/api/env"
ENV_FILE="/home/ubuntu/app/.env"

# Fetch secret JSON
SECRET_JSON=$(aws secretsmanager get-secret-value \
    --secret-id $SECRET_NAME \
    --query SecretString \
    --output text)

# Convert JSON to KEY=value format
echo "$SECRET_JSON" | jq -r 'to_entries | .[] | "\(.key)=\(.value)"' > $ENV_FILE

# --- Fetch EC2 public IP using IMDSv2 ---
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")

PUBLIC_IP=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/public-ipv4)

# Insert or update SWAGGER_DOMAINS
if grep -q "^SWAGGER_DOMAINS=" "$ENV_FILE"; then
    sed -i "s|^SWAGGER_DOMAINS=.*|SWAGGER_DOMAINS=http://$PUBLIC_IP|" "$ENV_FILE"
else
    echo "SWAGGER_DOMAINS=http://$PUBLIC_IP" >> "$ENV_FILE"
fi

# Fix permissions
chown ubuntu:ubuntu $ENV_FILE
chmod 600 $ENV_FILE
