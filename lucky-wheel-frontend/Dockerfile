# Build Stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production Stage
FROM nginx:alpine

# Create nginx.conf directly inside container to avoid build context issues
RUN echo 'server { \
    listen 80; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
    } \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
    root /usr/share/nginx/html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx with a script to dump env vars to env-config.js
CMD ["/bin/sh", "-c", "echo \"window.ENV = { VITE_API_URL: '${VITE_API_URL}' };\" > /usr/share/nginx/html/env-config.js && nginx -g 'daemon off;'"]
