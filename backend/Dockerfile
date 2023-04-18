FROM node:18-alpine
ENV NODE_ENV=production 
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build
EXPOSE 3001
CMD [ "node", "dist/server.js" ]
