FROM node:18-alpine AS build
ENV NODE_ENV=production 
COPY . /app
WORKDIR /app
RUN npm install -g vite@4.2.0
RUN npm run build

FROM node:18-alpine
COPY --from=build /app /app
WORKDIR /app
EXPOSE 3000
CMD ["node", "./build/index.js"]
