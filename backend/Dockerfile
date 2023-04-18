FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

RUN npm run build

CMD [ "node", "dist/src/server.js" ]
