FROM node:22.14.0-alpine3.20

RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY . .
RUN npm install

RUN npm run build
CMD ["npm", "run", "start"]