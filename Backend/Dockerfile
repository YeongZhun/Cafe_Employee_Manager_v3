# Backend/Dockerfile

# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the seed command to initialize the database (only once)
CMD ["sh", "-c", "npm run seed && npm run dev"]

