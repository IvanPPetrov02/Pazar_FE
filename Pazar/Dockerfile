# Stage 1: Build the application
FROM node:18-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM node:18-alpine

WORKDIR /app

# Install serve to run the application
RUN npm install -g serve

# Copy the build directory from the build stage
COPY --from=build /app/dist /app

# Expose the port serve runs on
EXPOSE 3000

# Command to serve the application
CMD ["serve", "-s", "/app", "-l", "3000"]
