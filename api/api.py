from flask import Flask, request, Response
from flask_cors import CORS

from stream import generate_stream, generate_video, generate_image, generate_rtsp_stream, generate_video_like_stream, send_image
from detect import run_detect, load_models


import os
import sys
from pathlib import Path

import cv2
import numpy as np
import torch

FILE = Path(__file__).resolve()
ROOT = FILE.parents[0]  # YOLOv5 root directory
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))  # add ROOT to PATH
ROOT = Path(os.path.relpath(ROOT, Path.cwd()))  # relative

from models.experimental import attempt_load
from utils.datasets import LoadImages, LoadStreams
from utils.general import apply_classifier, check_img_size, check_imshow, check_requirements, check_suffix, colorstr, \
    increment_path, non_max_suppression, print_args, save_one_box, scale_coords, set_logging, \
    strip_optimizer, xyxy2xywh
from utils.plots import Annotator, colors
from utils.torch_utils import load_classifier, select_device, time_sync

from utils.augmentations import Albumentations, augment_hsv, copy_paste, letterbox, mixup, random_perspective

# from flask import Flask, request, jsonify, send_file, Response
# from flask_cors import CORS

import subprocess

app = Flask(__name__)
CORS(app)  # Разрешить все источники


channel = {
    "optic": "rtsp://admin:123456@192.168.1.77:554/stream_chn0.h264",
    "termal": "rtsp://admin:123456@192.168.1.77:554/stream_chn1.h264",
}

video = {
    # "optic": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    # "termal": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "optic": "../data/records/20240521-132110-802.asf",
    "termal": "../data/records/20240521-132110-829.asf",
}

model = {
    "pt": "models/synt_model.pt",
    "donguz": "models/best_donguz.pt",
    "synthetic": "models/best_synthetic.pt",
    "onnx": "models/model_os.onnx"
}



def is_device_reachable():
    try:
        # Запускаем команду ping (1 запрос)
        result = subprocess.run(
            ["ping", "-n", "1", "192.168.1.77"],  # Для Windows
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE, 
            text=True
        )
        # Проверяем код возврата: 0 - успешный пинг
        return result.returncode == 0
    except Exception as e:
        print(f"Ошибка: {e}")
        return False




# Главная страница для потокового видео
@app.route('/stream')
def stream_feed():
    is_stream = request.args.get('login', "false")
    type_channel = request.args.get('type', "optic")

    print(is_stream)

    if is_stream == "true":
        stream_channel = channel[type_channel]
        print("Запрос на поток", type_channel, stream_channel)
        return Response(generate_stream(stream_channel),
                mimetype='multipart/x-mixed-replace; boundary=frame')
    
    else:
        stream_channel = video[type_channel]
        print("Запрос на поток", type_channel, stream_channel)
        return Response(generate_video_like_stream(stream_channel),
            mimetype='multipart/x-mixed-replace; boundary=frame')

    # if is_device_reachable():
    #     stream_channel = channel[type_channel]
    #     print("Запрос на поток", type_channel, stream_channel)
    #     return Response(generate_stream(stream_channel),
    #             mimetype='multipart/x-mixed-replace; boundary=frame')
    # else:
    #     stream_channel = video[type_channel]
    #     print("Запрос на поток", type_channel, stream_channel)
    #     return Response(generate_video_like_stream(stream_channel),
    #         mimetype='multipart/x-mixed-replace; boundary=frame')



# current_position = {}  # Глобальный словарь для хранения текущей позиции каждого видеофайла

import threading
import queue
import time

current_position = {}  # Глобальный словарь для хранения текущей позиции каждого видеофайла

class VideoStreamer:
    def __init__(self, video_path, buffer_size=10):
        self.video_path = video_path
        self.buffer_size = buffer_size
        self.frame_queue = queue.Queue(maxsize=self.buffer_size)
        self.stop_event = threading.Event()
        self.thread = None

    def start(self):
        if self.thread is None or not self.thread.is_alive():
            self.thread = threading.Thread(target=self.stream_frames)
            self.thread.start()

    def stop(self):
        self.stop_event.set()
        if self.thread is not None:
            self.thread.join()

    def stream_frames(self):
        cap = cv2.VideoCapture(self.video_path)
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 480)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 360)

        filename = os.path.basename(self.video_path)  # Получаем только имя файла

        # Если текущая позиция сохранена, устанавливаем её
        if filename in current_position:
            cap.set(cv2.CAP_PROP_POS_FRAMES, current_position[filename])

        while not self.stop_event.is_set():
            ret, frame = cap.read()
            if not ret:
                print(f"Ошибка при захвате кадра, перематываем видео {self.video_path} на начало")
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue

            # Сохраняем текущую позицию видеофайла
            current_position[filename] = cap.get(cv2.CAP_PROP_POS_FRAMES)

            try:
                self.frame_queue.put_nowait(frame)
            except queue.Full:
                pass

            time.sleep(0.01)  # Небольшая пауза для предотвращения перегрузки процессора

        cap.release()

    def get_frame(self):
        try:
            return self.frame_queue.get(timeout=1)
        except queue.Empty:
            return None


# import threading
# import queue
# import time

# class VideoStreamer:
#     def __init__(self, video_path, buffer_size=10):
#         self.video_path = video_path
#         self.buffer_size = buffer_size
#         self.frame_queue = queue.Queue(maxsize=self.buffer_size)
#         self.stop_event = threading.Event()
#         self.thread = None

#     def start(self):
#         if self.thread is None or not self.thread.is_alive():
#             self.thread = threading.Thread(target=self.stream_frames)
#             self.thread.start()

#     def stop(self):
#         self.stop_event.set()
#         if self.thread is not None:
#             self.thread.join()

#     def stream_frames(self):
#         cap = cv2.VideoCapture(self.video_path)
#         cap.set(cv2.CAP_PROP_FRAME_WIDTH, 480)
#         cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 360)

#         while not self.stop_event.is_set():
#             ret, frame = cap.read()
#             if not ret:
#                 print("Ошибка при захвате кадра, перематываем видео на начало")
#                 cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
#                 continue

#             try:
#                 self.frame_queue.put_nowait(frame)
#             except queue.Full:
#                 pass

#             time.sleep(0.01)  # Небольшая пауза для предотвращения перегрузки процессора

#         cap.release()

#     def get_frame(self):
#         try:
#             return self.frame_queue.get(timeout=1)
#         except queue.Empty:
#             return None




@app.route('/file', methods=['GET'])
def file_feed():
    global current_position

    file = request.args.get('type', 'video_04_27_2023_07_59_49_index_11.jpg')
    flag_detect = request.args.get('detect', 'false').lower() == 'true'

    dir_file = 'data/old' if flag_detect else 'data'
    temp = os.path.join(parent_directory, dir_file)
    path = os.path.join(temp, file)
    print("Файл", path)

    # Работает с изображением
    if ".jpg" in path.lower():
        return Response(
            generate_image(device, half, imgsz, model, names, dt, path, flag_detect),
            mimetype='multipart/x-mixed-replace; boundary=frame'
        )

    # Работа с видео файлом
    else:
        def generate_empty(video_channel):
            streamer = VideoStreamer(video_channel)
            streamer.start()

            while True:
                frame = streamer.get_frame()
                if frame is not None:
                    yield send_image(frame)

            streamer.stop()

        return Response(
            # generate_video(device, half, imgsz, model, names, dt, path, flag_detect),
            generate_empty(path),
            mimetype='multipart/x-mixed-replace; boundary=frame'
        )





if __name__ == "__main__":
    # Initialize
    set_logging()  # настраивает параметры логирования
    device = ''
    half = False
    device = select_device(device)
    half &= device.type != 'cpu'  # half precision only supported on CUDA

    stride = 64
    img_sz = [640, 640]
    imgsz = check_img_size(img_sz, s=stride)  # check image size

    # Получение пути к текущему файлу
    current_file_path = os.path.realpath(__file__)
    current_directory = os.path.dirname(current_file_path)
    parent_directory = os.path.dirname(current_directory)

    available_cores = os.cpu_count()
    print(f"Доступное количество потоков: {available_cores}")

    # Загружаем модель
    model, names, dt = load_models(device, half, imgsz, model["donguz"])

    # Запускаем Flask сервер в основном потоке
    app.run(host='0.0.0.0', port=5000, debug=True)




