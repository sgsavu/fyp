FROM node:14

WORKDIR /app

COPY package*.json/ ./

RUN npm install

COPY . .

EXPOSE 80
EXPOSE 443

CMD ["npm","run","api"]