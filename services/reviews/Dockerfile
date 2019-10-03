FROM node:10

WORKDIR /reviews

COPY package-lock.json .
COPY package.json .

RUN npm ci

COPY source source
COPY entrypoint.sh .

ENTRYPOINT [ "./entrypoint.sh" ]
