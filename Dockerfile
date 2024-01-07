FROM node:20-alpine as builder

ARG DATABASE_URL

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma migrate deploy
RUN npm run deploy:commands
RUN npm run build

# Remove all dependencies except production dependencies
RUN npm prune --production

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist .
COPY --from=builder /app/.env .
COPY --from=builder /app/node_modules/ ./node_modules/

ENTRYPOINT [ "node index.js" ]