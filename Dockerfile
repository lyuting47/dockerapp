FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build --omit=dev
RUN npm install -g serve
CMD serve -s build
EXPOSE 3000
