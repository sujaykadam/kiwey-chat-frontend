FROM node:20.10-alpine3.18

EXPOSE 3000

WORKDIR /

COPY . .

RUN cd kiwey-chat-backend

RUN npm install

RUN cd ..

RUN npm install

RUN npm run build

ENTRYPOINT ["npm", "run", "start"]