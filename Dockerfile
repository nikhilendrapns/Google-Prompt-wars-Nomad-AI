# Use Node.js LTS
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy all files
COPY . .

# Build the frontend
RUN npm run build

# Expose port (Cloud Run defaults to 8080, but we use 3000 mapping internally)
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["npm", "start"]
