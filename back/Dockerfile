FROM node

COPY . .

# RUN cp .env.prod .env

RUN yarn -v || npm i -g yarn

RUN yarn 

RUN yarn build

CMD ["yarn", "start"]