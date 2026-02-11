#!/bin/bash
# Добавляем пустую строку в конец и пересоздаем .env без лишних символов
sed -i '$a' /root/projects/sitiy_han/.env
echo "Файл .env исправлен. Перезагружаем контейнеры..."
cd /root/projects/sitiy_han && docker compose up -d
