FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm install --production
RUN npm run build --production
RUN npm install -g serve
CMD serve -s build
EXPOSE 3000
