# Используем официальный Windows образ для Node.js
FROM mcr.microsoft.com/windows/servercore:ltsc2019 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем Node.js (если не установлен в базовом образе)
RUN powershell -Command \
    Invoke-WebRequest -Uri https://nodejs.org/dist/v16.20.1/node-v16.20.1-x64.msi -OutFile nodejs.msi; \
    Start-Process msiexec.exe -ArgumentList '/i', 'nodejs.msi', '/quiet', '/norestart' -NoNewWindow -Wait; \
    Remove-Item -Force nodejs.msi

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./ 
RUN npm install

# Копируем все файлы проекта в контейнер
COPY . .

# Строим Angular приложение
RUN npm run build --prod


# Используем Windows образ с IIS
FROM mcr.microsoft.com/windows/servercore:ltsc2019

# Устанавливаем IIS
RUN powershell -Command \
    Install-WindowsFeature Web-Server, Web-Static-Content, Web-Default-Doc, Web-ASP-Net45, Web-Net-Ext45

# Копируем скомпилированный проект из build контейнера в директорию IIS
COPY --from=build /app/dist/frontend /inetpub/wwwroot

# Открываем порт 80 для внешнего мира
EXPOSE 80

# Запускаем IIS сервер
CMD ["powershell", "-NoExit", "-Command", "Start-Service W3SVC; Wait-Event"]


# Сборка под Linux
# # Указываем базовый образ для Node.js
# FROM node:16 AS build

# # Устанавливаем рабочую директорию
# WORKDIR /app

# # Копируем package.json и устанавливаем зависимости
# COPY package*.json ./
# RUN npm install

# # Копируем все файлы проекта в контейнер
# COPY . .

# # Строим Angular приложение
# RUN npm run build --prod

# # Используем легковесный сервер для сервировки статики
# FROM nginx:alpine

# # Копируем скомпилированный проект из первого контейнера в директорию Nginx
# COPY --from=build /app/dist/frontend /usr/share/nginx/html

# # Открываем порт 80 для внешнего мира
# EXPOSE 80

# # Запускаем Nginx сервер
# CMD ["nginx", "-g", "daemon off;"]