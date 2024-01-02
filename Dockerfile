# syntax = docker/dockerfile:1.2
FROM node:20.10-alpine3.19
EXPOSE 3000

WORKDIR /usr/src/kiwey-chat-frontend

COPY . .

RUN --mount=type=secret,id=_env,dst=./.env cat ./.env

RUN npm install
RUN npx prisma generate --schema ./src/prisma/schema.prisma

RUN npm install --prefix ./kiwey-chat-backend
RUN npx prisma generate --schema=./kiwey-chat-backend/src/prisma/schema.prisma

RUN npm run build

ENTRYPOINT ["npm", "run", "start"]
