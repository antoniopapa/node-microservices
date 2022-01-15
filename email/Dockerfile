FROM node:17

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

CMD npm start
