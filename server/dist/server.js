"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = __importStar(require("ws"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const wss = new ws_1.WebSocketServer({ port: 8081 });
wss.on('connection', (ws) => {
    ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        const { content, userId } = JSON.parse(message.toString());
        const msg = yield prisma.message.create({
            data: {
                content: content,
                userId: parseInt(userId),
            }
        });
        const user = yield prisma.user.findFirstOrThrow({
            where: {
                id: parseInt(userId),
            }
        });
        const jsonMessage = JSON.parse(message.toString());
        jsonMessage.email = user.email;
        jsonMessage.id = msg.id;
        console.log(jsonMessage);
        wss.clients.forEach((client) => {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(JSON.stringify(jsonMessage));
            }
        });
    }));
});
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findFirstOrThrow({
            where: {
                email: email,
            },
        });
        if (user.password == password) {
            res.status(200).json({
                userId: user.id
            });
        }
        else {
            res.status(404).json({
                error: "Senha incorreta"
            });
        }
    }
    catch (e) {
        const newUser = yield prisma.user.create({
            data: {
                email: email,
                password: password,
            },
        });
        res.status(201).json({
            userId: newUser.id
        });
    }
}));
app.get('/user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield prisma.user.findFirstOrThrow({
            where: {
                id: parseInt(userId),
            },
        });
        res.status(200).json({
            userId: user.id,
            email: user.email,
        });
    }
    catch (e) {
        res.status(404).json({
            error: "Usuário não encontrado"
        });
    }
}));
app.get('/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield prisma.message.findMany({});
    let messagesWithUser = [];
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const user = yield prisma.user.findFirstOrThrow({
            where: {
                id: message.userId,
            },
        });
        messagesWithUser.push({
            id: message.id,
            content: message.content,
            email: user.email,
            userId: user.id,
        });
    }
    res.status(200).json(messagesWithUser);
}));
app.listen(8080);
