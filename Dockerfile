FROM node:16.15.1-alpine3.15

WORKDIR /app

COPY . .

ENV PORT 3000

EXPOSE $PORT

RUN npm i

CMD ["npm", "run", "serve"]