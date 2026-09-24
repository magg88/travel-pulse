# Слика на Node.js
FROM node:20-alpine

# Работен директориум
WORKDIR /app

# Копирање на package.json
COPY package*.json ./

# Инсталација на зависности
RUN npm install

# Копирање на сите фајлови од фронтендот
COPY . .

# Експонирање на порта 5173 (Vite)
EXPOSE 5173

# Стартување на Vite со хост опција
CMD ["npm", "run", "dev", "--", "--host"]