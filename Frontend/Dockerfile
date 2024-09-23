# Frontend/Dockerfile

# Use the official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 8080
EXPOSE 8080

# Run the Vite development server
CMD ["npm", "run", "dev"]
