FROM node:10

WORKDIR /gateway

COPY package-lock.json .
COPY package.json .

RUN npm ci

COPY source source
