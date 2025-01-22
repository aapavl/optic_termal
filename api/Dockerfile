# Используем базовый образ Python
FROM python:3.7

# Устанавливаем зависимости для OpenCV
RUN apt-get update && apt-get install -y \
    libopencv-dev python3-opencv ffmpeg && \
    apt-get clean

# Создаем рабочую директорию
WORKDIR /app

# Копируем файл stream.py в контейнер
COPY stream.py .

# Устанавливаем зависимости Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Открываем порт для Flask
EXPOSE 5000

# Команда для запуска приложения
CMD ["python", "stream.py"]


# FROM mcr.microsoft.com/windows/servercore:ltsc2019

# # Установка Python
# RUN powershell -Command \
#     Invoke-WebRequest -Uri https://www.python.org/ftp/python/3.7.9/python-3.7.9-amd64.exe -OutFile python-3.7.9-amd64.exe; \
#     Start-Process python-3.7.9-amd64.exe -ArgumentList '/quiet InstallAllUsers=1 PrependPath=1' -NoNewWindow -Wait; \
#     Remove-Item -Force python-3.7.9-amd64.exe

# # Установка Visual C++ Redistributable
# RUN powershell -Command \
#     Invoke-WebRequest -Uri https://aka.ms/vs/16/release/vc_redist.x64.exe -OutFile vc_redist.x64.exe; \
#     Start-Process vc_redist.x64.exe -ArgumentList '/quiet' -NoNewWindow -Wait; \
#     Remove-Item -Force vc_redist.x64.exe

# # Дополнительная версия Visual C++ Redistributable для OpenCV
# RUN powershell -Command \
#     Invoke-WebRequest -Uri https://download.visualstudio.microsoft.com/download/pr/9bb5df1e-4c4a-4a97-ae64-dcc4fca6e88e/9D8A3C8A9A92ED3B53FDF9D9F2E93248EF7FA57111A54259A8A480229E5FBBB8/VC_redist.x64.exe -OutFile vc_redist_2015_2019.exe; \
#     Start-Process vc_redist_2015_2019.exe -ArgumentList '/quiet' -NoNewWindow -Wait; \
#     Remove-Item -Force vc_redist_2015_2019.exe


# # # Копируем заранее загруженный архив в контейнер
# # COPY ffmpeg-2025-01-15-git-4f3c9f2f03-essentials_build.zip ffmpeg.zip

# # # Распаковываем архив в папку C:\ffmpeg
# # RUN powershell -Command \
# #     Expand-Archive -Path ffmpeg.zip -DestinationPath C:\ffmpeg; \
# #     Remove-Item -Force ffmpeg.zip

# # # Добавление Python и FFmpeg в PATH
# # RUN setx PATH "%PATH%;C:\\Python37;C:\\Python37\\Scripts;C:\\ffmpeg\\bin"

# # Проверяем, что Python корректно установлен
# RUN python --version

# # # Обновление pip и установка зависимостей
# # RUN python -m pip install --upgrade pip setuptools wheel

# # COPY requirements.txt .
# # RUN pip install --no-cache-dir -r requirements.txt

# # Установка зависимостей Python
# RUN pip install --no-cache-dir Flask Flask-Cors opencv-python opencv-contrib-python

# RUN python -c "import cv2; print(cv2.getBuildInformation())"


# # Копирование приложения
# WORKDIR /app
# COPY . /app

# # Запуск приложения
# CMD ["python", "stream.py"]
