FROM node:18-alpine
ENV NODE_ENV=production 
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["node", "./build/index.js"]
