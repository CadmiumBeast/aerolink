FROM node:18-alpine

WORKDIR /app

# Copy package descriptors first to optimize Docker layer caching
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your React application source code
COPY . .

# Expose port 3000 (The default React development server port)
EXPOSE 3000

# Start the local development server
CMD ["npm", "start"]