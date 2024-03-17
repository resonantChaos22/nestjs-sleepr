FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./

RUN npm install -g pnpm
RUN pnpm install -r

COPY apps/reservations apps/reservations
COPY libs libs

RUN pnpm run build reservations

FROM node:alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --omit=dev

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/reservations/main.js"]
