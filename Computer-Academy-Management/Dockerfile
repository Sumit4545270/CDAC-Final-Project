# Use official Node.js LTS version (Alpine variant)
FROM node:18-alpine

# Skip Chromium download for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Update Alpine packages and fix OpenSSL vulnerabilities
RUN apk update && apk upgrade --no-cache \
    libcrypto3 libssl3

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Default command to run the app
CMD ["npm", "start"]
