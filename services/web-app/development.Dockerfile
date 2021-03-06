FROM node:10

WORKDIR /web-app

COPY package-lock.json .
COPY package.json .

RUN npm ci

COPY source source
COPY babel.config.js .
COPY webpack.config.js .
