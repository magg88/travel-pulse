# TravelPulse 

Динамична веб-апликација за планирање патувања, организирање итинерари, пребарување атракции и следење на буџет.

---

## Линк до апликацијата 
- **Веб-апликација:** [https://travel-pulse-sh21.onrender.com/login]
- **Swagger API Документација:** [http://localhost:3000/api/docs/]

---

## Структура на проектот

* `part1-static/` - Статички HTML / Bootstrap 5 маски (Дел 1)
* `frontend/` - React SPA кориснички интерфејс (Дел 4)
* `server.js` - Express.js бекенд REST API сервер (Дел 2 & 3)
* `models/` - Mongoose шеми за MongoDB
* `Dockerfile` & `docker-compose.yml` - Docker контејнеризација

---

## Упатство за стартување

### Опција 1: Стартување преку Docker 

За стартување на целосната апликација (заедно со базата) со една команда:

```bash
docker-compose up --build