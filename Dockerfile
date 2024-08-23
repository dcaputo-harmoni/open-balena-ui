FROM node:22-alpine

ARG DEBIAN_FRONTEND=noninteractive

### set default NODE_ENV but allow overwrite with build-arg
ARG build_node_env=production
ENV NODE_ENV=$build_node_env

WORKDIR /usr/src/app

COPY ./server ./server
COPY ./src ./src
COPY ./webpack.config.js ./
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install --no-fund --no-update-notifier

COPY start.sh ./

CMD ["bash", "start.sh"]