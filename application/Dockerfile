FROM node:14.15.4

EXPOSE 4000

WORKDIR /application

COPY package*.json ./

RUN npm install

COPY src src

CMD npm run start