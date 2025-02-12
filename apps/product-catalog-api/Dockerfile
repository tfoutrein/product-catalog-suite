FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Installation des dépendances de production et développement
RUN npm install && \
    npm install -g nodemon

COPY . .

EXPOSE 3000

CMD ["npm", "start"] 