FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install --production
RUN npm install -g serve
COPY . .
RUN npm run build --production
CMD serve -s build
EXPOSE 3000
