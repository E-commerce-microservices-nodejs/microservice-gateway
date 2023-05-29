# Stage 1: Build the application
FROM node:16.20-bullseye-slim as builder
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

# Stage 2: Create a lightweight production image
FROM node:16.20-bullseye-slim
WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/build ./build

RUN npm ci --only=production

ENV PRODUCTS_SERVER=http://172.17.0.1:5001/api
ENV ORDERS_SERVER=http://172.17.0.1:5002/api
ENV PAYMENT_SERVER=http://172.17.0.1:5003/api
ENV PORT=5005
ENV MONGO_URI=mongodb://172.17.0.1/microservices

EXPOSE 5005

CMD ["node", "./build/server.js"]
