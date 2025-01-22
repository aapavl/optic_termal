# import cv2
# import time
# from flask import Flask, request, Response
# from flask_cors import CORS

# import numpy as np
# from datetime import datetime


# channel = {
#     # "termal": "rtsp://admin:123456@192.168.1.77:554/stream_chn1.h264",
#     # "optic": "rtsp://admin:123456@192.168.1.77:554/stream_chn0.h264",
#     "termal": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
#     "optic": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
# }


# app = Flask(__name__)
# CORS(app)  # Разрешить все источники



# def send_image(frame):
#     ret, jpeg = cv2.imencode('.jpg', frame)
#     if not ret:
#         return "Failed to encode image", 500

#     # Отправляем кадры через HTTP
#     frame_detect = jpeg.tobytes()
#     return (b'--frame\r\n'
#            b'Content-Type: image/jpeg\r\n\r\n' + frame_detect + b'\r\n\r\n')




# # Функция для генерации кадров для трансляции
# def generate_rtsp_stream(video):
#     cap = cv2.VideoCapture(video)
#     cap.set(cv2.CAP_PROP_FRAME_WIDTH, 480)  # Задайте фиксированный размер
#     cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 360)

#     # Получаем частоту кадров видео
#     fps = cap.get(cv2.CAP_PROP_FPS)
#     frame_delay = 1 / fps if fps > 0 else 0.033  # Время задержки между кадрами


#     while True:
#         ret, frame = cap.read()
#         # if not ret:
#         #     print("Ошибка при захвате кадра")
#         #     break

#         if not ret:
#             print("Ошибка при захвате кадра, перематываем видео на начало")
#             cap.set(cv2.CAP_PROP_POS_FRAMES, 0)  # Перематываем видео в начало
#             continue  # Переходим к следующему кадру

#         # Получаем текущую дату и время
#         current_time = datetime.now()
#         timestamp = current_time.strftime("%d/%m/%Y %H:%M:%S")

#         # Добавляем дату и время на кадр
#         font = cv2.FONT_HERSHEY_SIMPLEX
#         cv2.putText(frame, timestamp, (10, 30), font, 1, (255, 255, 255), 2, cv2.LINE_AA)


#         # Отправляем кадр в API или клиенту
#         yield send_image(frame)

#         # Задержка для синхронизации с реальным временем
#         time.sleep(frame_delay)




# # Главная страница для потокового видео
# @app.route('/emulator')
# def video_feed():
#     type_channel = request.args.get('type', "optic")
#     stream_channel = channel[type_channel]

#     print("Запрос на поток", type_channel, stream_channel)
#     return Response(generate_rtsp_stream(stream_channel),
#                     mimetype='multipart/x-mixed-replace; boundary=frame')


# if __name__ == "__main__":
#     # Запускаем Flask сервер в основном потоке
#     app.run(host='0.0.0.0', port=8000, debug=True)


