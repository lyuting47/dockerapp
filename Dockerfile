FROM node:18-alpine AS builder
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN ["npm", "ci", "--omit=dev"]
COPY . .
RUN ["npm", "run", "build", "--omit=dev"]

FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/build ./build
RUN ["npm", "install", "-g", "serve"]
EXPOSE 3000
CMD ["serve", "-s", "build"]
