import express from 'express';
import cors from 'cors';
import path from 'path';
import url from 'url';

import Config from './config.json' assert { type: "json" };
import { init, cleanup, login, wiper, ptz } from './dll-service.js'


const app = express();

// Настройка парсера JSON
app.use(cors());
app.use(express.json());

const dll = Config.api.dll;

// Инициализация
app.post(dll.init, (req, res) => {
    const result = init(req.body.protocolType);
    if (result > 0) {
        // console.log("Init success");
        res.json({ error: false, message: result });
    } else {
        res.status(500).json({ error: true, message: 'Init failed: ' + result });
    }
});

// Очистка
app.post(dll.cleanup, (req, res) => {
    const protocolType = req.body.protocolType;
    const result = cleanup(protocolType);
    if (result > 0) {
        res.json({  error: false, message: result });
    } else {
        res.status(500).json({ error: true, message: 'Cleanup failed: ' + result });
    }
});


// Логин на устройство
app.post(dll.login, (req, res) => {
    const result = login();
    if (result > 0) {
        // console.log("Login success");
        res.json({ error: false, message: result, userId: result });
    } else {
        res.status(500).json({ error: true, message: 'Login failed: ' + result });
    }
});


// 24.1 - Установите параметры стеклоочистителя - WiperSet
app.post(dll.wiper, (req, res) => {
    const { userId, wiperAction } = req.body
    console.log(userId, wiperAction);
    const result = wiper(userId, wiperAction);
    if (result > 0) {
        // console.log("Wiper success");
        res.json({ error: false, message: result, userId: userId, wiperAction: wiperAction });
    } else {
        res.status(500).json({ error: true, message: 'Wiper failed: ' + result });
    }
});


// 31.1 - Управление PTZ - PTZ
app.post(dll.ptz, (req, res) => {
    const { userId, channelId, command } = req.body
    const result = ptz(userId, channelId, command);
    if (result > 0) {
        // console.log("PTZ success: ", command);
        res.json({ error: false, message: result, userId: userId, channelId: channelId, command: command });
    } else {
        res.status(500).json({ error: true, message: 'PTZ failed: ' + result });
    }
});



app.listen(dll.port, () => {
    console.log(`Server running on ${Config.localhost + dll.port}`);
});

