FROM node:18-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app
RUN npm install

COPY . ./usr/src/app

EXPOSE 3001

RUN npm run build

CMD [ "node", "dist/server.js" ]