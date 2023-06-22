FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
RUN npm install -g serve
COPY . .
RUN npm run build --omit=dev
CMD serve -s build
EXPOSE 3000
