FROM node:18 as base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

FROM base as production

ENV NODE_PATH=./build

RUN npm run build

EXPOSE 3001

CMD [ "node", "dist/server.js" ]
