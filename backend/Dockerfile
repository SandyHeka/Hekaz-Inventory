# Use official Node.js image
FROM node:20

# Create app directory inside container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install deps
RUN npm install

# Copy all source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose API port
EXPOSE 5000

# Run the built app
CMD ["node", "dist/server.js"]
