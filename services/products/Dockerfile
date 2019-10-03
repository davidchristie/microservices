FROM node:10

WORKDIR /products

COPY package-lock.json .
COPY package.json .

RUN npm ci

COPY source source
COPY tsconfig.json .

RUN npm run build

COPY entrypoint.sh .

ENTRYPOINT ["./entrypoint.sh"]
