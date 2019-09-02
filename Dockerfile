FROM mhart/alpine-node:10.16.3

RUN mkdir /app
WORKDIR /app
COPY ./ /app
RUN apk update
RUN apk add --no-cache bash
RUN npm install -g yarn @adonisjs/cli
RUN yarn install
RUN rm -rf /var/cache/apk/*

EXPOSE 3333

CMD [ "adonis", "serve" ]
