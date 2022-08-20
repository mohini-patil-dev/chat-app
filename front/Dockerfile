FROM node

COPY . .

RUN yarn -v || npm i -g yarn

RUN yarn 

RUN yarn build

RUN yarn global add serve

CMD ["serve", "-s", "build"]