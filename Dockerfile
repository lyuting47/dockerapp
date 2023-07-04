FROM node:18-alpine3.18 AS builder
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN ["npm", "ci"]
COPY . .
RUN ["npm", "run", "build"]

FROM nginx:1.24
ENV NODE_ENV=production
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
