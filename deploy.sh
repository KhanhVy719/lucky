#!/bin/bash

# Deployment Script for Lucky Wheel on VPS
# Installs Docker, sets up SSL with Let's Encrypt (via Caddy), and runs the app.

echo "======================================================="
echo "   LUCKY WHEEL AUT DEPLOYMENT SCRIPT (VPS)"
echo "======================================================="

# 1. Update System & Install Docker (if not exists)
if ! command -v docker &> /dev/null
then
    echo "Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo "Docker installed successfully."
else
    echo "Docker is already installed."
fi

# 2. Input Configuration
echo ""
echo "Please enter your configuration details:"
read -p "Enter your Domain (e.g., lucky.example.com): " DOMAIN
read -p "Enter your Email (for SSL certificates): " EMAIL
read -p "Enter a secure Admin Password for the App: " ADMIN_PASS
read -s -p "Enter a secure Database Password: " DB_PASS
echo ""

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "Error: Domain and Email are required!"
    exit 1
fi

# 3. Create Caddyfile for SSL routing
echo "Creating Caddyfile..."
cat > Caddyfile <<EOF
$DOMAIN {
    # SSL Configuration
    tls $EMAIL

    # Route /api/* requests to Backend
    handle /api/* {
        reverse_proxy backend:3000
    }

    # Route all other requests to Frontend
    handle /* {
        reverse_proxy frontend:80
    }
}
EOF

# 4. Create .env file for Docker Compose
echo "Creating .env file..."
cat > .env <<EOF
DOMAIN=$DOMAIN
EMAIL=$EMAIL
ADMIN_PASSWORD=$ADMIN_PASS
DB_PASSWORD=$DB_PASS
JWT_SECRET=$(openssl rand -hex 32)
EOF

# 5. Run Docker Compose
echo "Starting Application..."
docker compose -f docker-compose.prod.yml up -d --build

echo "======================================================="
echo "   DEPLOYMENT COMPLETE!"
echo "   Your app should be live at: https://$DOMAIN"
echo "======================================================="
