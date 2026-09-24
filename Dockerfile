FROM node:18-alpine

WORKDIR /app

# Инсталирање бекенд зависности
COPY package*.json ./
RUN npm install

# Инсталирање фронтенд зависности
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Копирање на изворниот код
COPY . .

# Билдање на Vite фронтендот
RUN cd frontend && npm run build

EXPOSE 3000

CMD ["node", "server.js"]