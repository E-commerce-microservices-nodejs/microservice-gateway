
# Stage 1: Build the application
FROM node:16.20-bullseye-slim AS build

# Set environment variables
ENV NODE_ENV=development
ENV PORT=5005
ENV PRODUCTS_SERVER=http://product-service:5001/api
ENV ORDERS_SERVER=http://order-service:5002/api
ENV PAYMENT_SERVER=http://payment-service:5003/api
ENV MONGO_URI=mongodb://mongodb-service/microservices
ENV TOKEN_KEY=1321324




# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

RUN npm install

# Copy the source code and build the application
COPY . .
RUN npm run build

# Stage 2: Create the production image
FROM node:16.20-bullseye-slim

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5005
ENV PRODUCTS_SERVER=http://product-service:5001/api
ENV ORDERS_SERVER=http://order-service:5002/api
ENV PAYMENT_SERVER=http://payment-service:5003/api
ENV MONGO_URI=mongodb://mongodb-service/microservices
ENV TOKEN_KEY=1321324


# Set the working directory
WORKDIR /app

# Copy the build artifacts from the previous stage
COPY --from=build /app/build ./build

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production


# Expose the port on which the application listens
EXPOSE 5005

# Use a non-root user for security reasons
USER node

# Start the application
CMD ["node", "build/server.js"]