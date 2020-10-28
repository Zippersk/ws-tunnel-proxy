FROM node:lts-alpine

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . /app/

RUN npm run build

EXPOSE 8080

CMD [ "node", "dist/index.js" ]
