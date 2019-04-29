FROM mhart/alpine-node:latest

ADD package.json /package.json

ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin

WORKDIR /usr/app
COPY . /usr/app

RUN npm install --silent

CMD ["npm", "start"]