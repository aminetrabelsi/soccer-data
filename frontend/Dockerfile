FROM node:18-alpine AS build
ENV NODE_ENV development

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "yarn.lock", "./"]

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.23.4-alpine
COPY --from=build /app/public /usr/share/nginx/html