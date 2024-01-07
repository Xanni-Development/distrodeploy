FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

# Remove source file as it's not needed after build
RUN rm -r ./src

ENTRYPOINT [ "npx prisma migrate deploy && npm run deploy:commands && node index.js" ]