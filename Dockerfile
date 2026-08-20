# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm install

# Copy source code
COPY . .

# Build the backend
RUN npm run build

# Build the frontend client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built backend
COPY --from=builder /app/dist ./dist

# Copy built frontend
COPY --from=builder /app/client/dist ./client/dist

# Expose port (Cloud providers will inject PORT)
EXPOSE 3000

# Start command
CMD ["node", "dist/main"]
