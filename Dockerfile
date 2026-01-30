FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY server.js ./server.js
COPY src ./src

EXPOSE 5000

CMD ["node", "server.js"]
