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

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
