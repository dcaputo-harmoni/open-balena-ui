FROM node:22-alpine AS base

ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install --no-fund --no-update-notifier --no-audit \
    && npm cache clean --force

FROM base AS builder

COPY ./server ./server
COPY ./src ./src
COPY ./webpack.*.js ./

RUN NODE_ENV=development npm install --no-fund --no-update-notifier --no-audit \
    && npm cache clean --force \
    && BABEL_ENV=node npm run build

FROM base AS production-image

COPY --from=builder /usr/src/app/server/ /usr/src/app/server/
COPY --from=builder /usr/src/app/dist/ /usr/src/app/dist/

CMD ["npm", "run", "serve"]