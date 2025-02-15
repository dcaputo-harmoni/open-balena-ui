FROM debian:bookworm

ARG DEBIAN_FRONTEND=noninteractive

# Update nodejs version to 20.x
RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash -

RUN apt-get update && apt-get install -y \
    nodejs \
    node-typescript \
    jq \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY ./server ./server
COPY ./src ./src
COPY ./webpack.config.js ./
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci --no-fund --no-update-notifier

COPY start.sh ./

CMD ["bash", "start.sh"]