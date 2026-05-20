# 1. Build Stage
FROM node:18 AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only dependency files first (for layer caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the app (excluding node_modules via .dockerignore)
COPY . .

# Build the app
RUN pnpm build

# 2. Serve Stage (using Nginx)
FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
