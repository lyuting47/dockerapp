FROM node:18-alpine3.18 AS builder
WORKDIR /app
COPY package*.json ./
RUN ["npm", "ci"]
COPY . .
RUN ["npm", "run", "build"]

FROM nginx:1.24
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html/
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
