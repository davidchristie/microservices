FROM node:10

WORKDIR /inventory

COPY package-lock.json .
COPY package.json .

RUN npm ci

COPY source source
