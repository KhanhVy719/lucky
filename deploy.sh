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
    
    # Start and Enable Docker Service
    console "Starting Docker Service..."
    systemctl start docker
    systemctl enable docker
    
    echo "Docker installed successfully."
else
    echo "Docker is already installed."
fi

# 2. Input Configuration
echo ""
echo "Please enter your configuration details:"

DOMAIN=""
while [ -z "$DOMAIN" ]; do
    read -p "1. Enter your Domain (e.g., lucky.example.com): " DOMAIN
done

EMAIL=""
while [ -z "$EMAIL" ]; do
    read -p "2. Enter your Email (for SSL certificates): " EMAIL
done

ADMIN_PASS=""
while [ -z "$ADMIN_PASS" ]; do
    read -p "3. Enter a secure Admin Password for the App: " ADMIN_PASS
done

DB_PASS=""
while [ -z "$DB_PASS" ]; do
    read -s -p "4. Enter a secure Database Password: " DB_PASS
    echo "" # New line after silent input
done

echo ""
echo "-------------------------------------------------------"
echo "Configuration Confirmed:"
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo "-------------------------------------------------------"
echo ""

# Remove check since we loop until valid
# if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then ... fi

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
