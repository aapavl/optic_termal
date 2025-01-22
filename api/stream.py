from flask import Flask, request, Response
from flask_cors import CORS
import time
import cv2

from detect import run_detect

from datetime import datetime


def send_image(frame):
    ret, jpeg = cv2.imencode('.jpg', frame)
    if not ret:
        return "Failed to encode image", 500

    # Отправляем кадры через HTTP
    frame_detect = jpeg.tobytes()
    return (b'--frame\r\n'
           b'Content-Type: image/jpeg\r\n\r\n' + frame_detect + b'\r\n\r\n')




# Трансляция преобразованого видеопотока
def generate_stream(video):
    cap = cv2.VideoCapture(video)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 480)  # Задайте фиксированный размер
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 360)

    # Время последнего отправленного кадра
    last_frame_time = time.time()

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Ошибка при захвате кадра")
            break

        # Текущее время
        current_time = time.time()

        # Проверяем, прошла ли 1 секунда с момента последнего кадра
        if current_time - last_frame_time >= 0.1:
            last_frame_time = current_time  # Обновляем время последнего кадра

            yield send_image(frame)


# Трансляция загруженного видеофайла
def generate_video_like_stream(video_channel):
    # Запускаем захват видеопотока
    cap = cv2.VideoCapture(video_channel)
    cap.set(cv2.CAP_PROP_FPS, 30)  # Ограничьте FPS
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 480)  # Задайте фиксированный размер
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    # Выкидываем кадры по адресу
    while True:
        ret, frame = cap.read()

        # Если достигнут конец видео, возвращаемся к началу
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue

        yield send_image(frame)



# Функция для генерации кадров для трансляции
def generate_rtsp_stream(device, half, imgsz, model, names, dt, video_channel, flag_detect=False):
    cap = cv2.VideoCapture(video_channel)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 480)  # Задайте фиксированный размер
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 360)

    # Получаем частоту кадров видео
    fps = cap.get(cv2.CAP_PROP_FPS)
    print("fps", fps)

    cap_count = 0
    # frame_delay = 1 / fps if fps > 0 else 0.033  # Время задержки между кадрами

    # Время последнего отправленного кадра
    last_frame_time = time.time()

    while True:
        ret, frame = cap.read()
        # if not ret:
        #     print("Ошибка при захвате кадра")
        #     break

        if not ret:
            print("Ошибка при захвате кадра, перематываем видео на начало")
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)  # Перематываем видео в начало
            continue  # Переходим к следующему кадру

        # Текущее время
        current_time = time.time()

        # Проверяем, прошла ли 1 секунда с момента последнего кадра
        if current_time - last_frame_time >= 0.1:
            last_frame_time = current_time  # Обновляем время последнего кадра

            if flag_detect:
                if cap_count % fps != 0:
                    cap_count = cap_count + 1
                    continue

                frame = run_detect(device, half, imgsz, model, names, dt, frame)  # просто кадры после нейронки

        yield send_image(frame)





# Трансляция загруженного видеофайла
def generate_video(device, half, imgsz, model, names, dt, video_channel, flag_detect=False):
    # Запускаем захват видеопотока
    cap = cv2.VideoCapture(video_channel)
    cap.set(cv2.CAP_PROP_FPS, 30)  # Ограничьте FPS
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 480)  # Задайте фиксированный размер
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    cap_count = 0

    # Выкидываем кадры по адресу
    while True:
        cap_count += 1
        ret, frame = cap.read()

        # Если достигнут конец видео, возвращаемся к началу
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue

        # Освобождаем видеопоток
        # if not ret:
        #     cap.release()
        #     break

        if flag_detect:
            if cap_count % 3 != 0:
                continue

            frame = run_detect(device, half, imgsz, model, names, dt, frame)  # просто кадры после нейронки

        yield send_image(frame)






# Трансляция загруженного изображения
def generate_image(device, half, imgsz, model, names, dt, path, flag_detect=False):
    frame = cv2.imread(path)
    if frame is None:
        return "Image not found or cannot be read", 404

    if flag_detect:
        frame = run_detect(device, half, imgsz, model, names, dt, frame)  # просто кадры после нейронки

    yield send_image(frame)
