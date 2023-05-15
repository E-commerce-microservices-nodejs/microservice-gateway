# Base Node.js image
FROM node:16.20-bullseye-slim

# Set environment variables for production
ENV NODE_ENV=production
ENV PRODUCTS_SERVER=http://product-service-container:5001/api
ENV ORDERS_SERVER=http://order-service-container:5002/api
ENV PAYMENTS_SERVER=http://payment-service-container:5003/api
ENV PORT=5005
ENV MONGO_URI=mongodb://mongodb-container/microservices


# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install production dependencies only (for security)
RUN npm ci --only=production && \
    npm cache clean --force

# Copy the rest of the source code
COPY . .

# Create the build directory and set appropriate permissions
RUN mkdir -p /app/build && \
    chown -R node:node /app/build

# Expose the port on which the application listens
EXPOSE 5005

# Use a non-root user for security reasons
USER node

# Start the application
CMD ["npm","run" ,"start:prod"]

# Specify the microservice-specific labels
LABEL version="1.0" description="Gateway microservice"



