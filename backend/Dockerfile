# Используем официальный Windows образ
FROM mcr.microsoft.com/windows/servercore:ltsc2019

# Устанавливаем рабочую директорию
WORKDIR /app

# Загружаем и устанавливаем Node.js
RUN powershell -Command \
    Invoke-WebRequest -Uri https://nodejs.org/dist/v16.20.1/node-v16.20.1-x64.msi -OutFile nodejs.msi; \
    Start-Process msiexec.exe -ArgumentList '/i', 'nodejs.msi', '/quiet', '/norestart' -NoNewWindow -Wait; \
    Remove-Item -Force nodejs.msi

# Проверяем версию Node.js
RUN setx PATH "C:\\Program Files\\nodejs;%PATH%" && node -v

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем все файлы проекта в контейнер
COPY . .

# Копируем DLL-библиотеку в контейнер
COPY IpcNetSDK.dll C:\\app\\libs\\IpcNetSDK.dll

# Устанавливаем переменные окружения
ENV PATH="C:\\Program Files\\nodejs;C:\\app\\libs;%PATH%"

# Открываем порт
EXPOSE 5001

# Запускаем приложение
CMD ["node", "dll-api.js"]



# # Используем официальный образ для Node.js
# FROM node:16

# # Устанавливаем рабочую директорию
# WORKDIR /app

# # Копируем package.json и устанавливаем зависимости
# COPY package*.json ./
# RUN npm install

# # Копируем DLL-библиотеку в контейнер (поменяйте путь на фактический)
# COPY IpcNetSDK.dll /app/libs/IpcNetSDK.dll

# # Копируем все файлы проекта
# COPY . .

# # Устанавливаем переменную окружения для поиска DLL-файлов
# ENV PATH="/app/libs:${PATH}"

# # # Set environment variable to include the path to the DLL
# # ENV LD_LIBRARY_PATH="/app/libs:${LD_LIBRARY_PATH}"

# # Открываем порт, на котором будет работать сервер
# EXPOSE 5001

# # Запускаем сервер
# CMD ["node", "dll-api.js"]