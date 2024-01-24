FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

CMD npx prisma migrate deploy && npx prisma generate && npm run deploy:commands && node ./dist/DiscordBot/index.js