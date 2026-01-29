# Build Stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config (This is safer than echo for complex configs)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx with a script to dump env vars to env-config.js
CMD ["/bin/sh", "-c", "echo \"window.ENV = { VITE_API_URL: '${VITE_API_URL}' };\" > /usr/share/nginx/html/env-config.js && nginx -g 'daemon off;'"]
