# Use Node.js 20 (official lightweight Alpine image)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set environment variable so React dev server listens on all interfaces
ENV HOST=0.0.0.0
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the React app (development mode)
CMD ["npm", "start"]
