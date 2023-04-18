FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "yarn.lock", "./"]
RUN npm install
COPY . .
EXPOSE 3001
RUN npm run build
CMD [ "node", "dist/server.js" ]