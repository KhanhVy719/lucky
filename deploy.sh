#!/bin/bash

# Deployment Script for Lucky Wheel on VPS
# Installs Docker, sets up SSL with Let's Encrypt (via Caddy), and runs the app.

echo "======================================================="
echo "   LUCKY WHEEL AUTO DEPLOYMENT SCRIPT (VPS)"
echo "======================================================="

# 1. Update System & Install Docker (if not exists)
if ! command -v docker &> /dev/null
then
    echo "Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    # Start and Enable Docker Service
    echo "Starting Docker Service..."
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

DATABASE_URL=""
while [ -z "$DATABASE_URL" ]; do
    echo "4. Enter your Supabase Connection String:"
    echo "   (Press Enter to use default: postgresql://postgres.ndcgyeawweszeltnfnjb:KHANHVYy.y2010@aws-1-ap-south-1.pooler.supabase.com:6543/postgres)"
    read -p "   DATABASE_URL: " INPUT_URL
    
    if [ -z "$INPUT_URL" ]; then
        DATABASE_URL="postgresql://postgres.ndcgyeawweszeltnfnjb:KHANHVYy.y2010@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
    else
        DATABASE_URL="$INPUT_URL"
    fi
    
    if [[ "$DATABASE_URL" != postgres* ]]; then
         echo "⚠️  Error: Connection String must start with 'postgres' or 'postgresql'"
         DATABASE_URL=""
    fi
done

echo ""
echo "-------------------------------------------------------"
echo "Configuration Confirmed:"
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo "-------------------------------------------------------"
echo ""

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
DATABASE_URL=$DATABASE_URL
JWT_SECRET=$(openssl rand -hex 32)
EOF

# 5. Run Docker Compose
echo "Starting Application..."
# Stop previous containers to remove Mongo if needed
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build

echo "======================================================="
echo "   DEPLOYMENT COMPLETE!"
echo "   Your app should be live at: https://$DOMAIN"
echo "======================================================="
