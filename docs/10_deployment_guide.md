# Инструкция по развертыванию (Deployment Guide)

Этот документ описывает процесс обновления и деплоя проекта Sytyi Han на VPS (Ubuntu).

## 1. Стек технологий деплоя
- **OS:** Ubuntu 22.04+ 
- **Containerization:** Docker + Docker Compose V2
- **Database:** PostgreSQL (в Docker)
- **ORM:** Prisma 6

## 2. Обновление кода (Git Workflow)
Всегда используйте GitHub как промежуточное звено для деплоя.

### На локальной машине:
Перед пушем убедитесь, что страницы с запросами к БД помечены:
`export const dynamic = "force-dynamic";` (иначе `next build` упадет без доступа к БД).

```bash
git add .
git commit -m "feat: description"
git push origin master
```

### На сервере (VPS):
```bash
cd ~/projects/sitiy_han
git reset --hard             # Отмена локальных правок сервера
rm -f next.config.mjs        # Удаление конфликтующих файлов
git pull origin master
```

## 3. Сборка и запуск (Docker)
Используется Docker Compose V2 (команда без дефиса).

```bash
docker compose up --build -d
```

## 4. Миграции Базы Данных (Prisma)
**Важно:** Всегда указывайте версию `@6`, чтобы избежать конфликтов с новыми версиями Prisma CLI.

```bash
# Применение новых миграций
docker compose exec app npx prisma@6 migrate deploy

# Если возник конфликт истории миграций (уже существует тип/таблица):
docker compose exec app npx prisma@6 migrate resolve --applied <migration_name>
```

## 5. Перенос данных (Backup/Restore)

### Экспорт с локальной машины:
```bash
docker exec -t <container_name> pg_dump -U postgres sitiy_han > backup.sql
scp backup.sql root@<vps_ip>:~/projects/sitiy_han/
```

### Импорт на сервере:
```bash
cat backup.sql | docker compose exec -T db psql -U postgres sitiy_han
```

## 6. Решение проблем (Troubleshooting)
- **Сборка зависла:** `docker compose down` и запуск заново.
- **Next.js выдает старый код:** Очистить папку `.next` и пересобрать.
- **БД недоступна:** Проверить `DATABASE_URL` в `.env`. Должно быть `db:5432` (имя сервиса), а не `localhost`.
- **Логи:** `docker compose logs -f app`
