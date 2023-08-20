import express from 'express'
import WebSocket, { WebSocketServer } from 'ws'
import { PrismaClient } from '@prisma/client'
import cors from 'cors';

const prisma = new PrismaClient()
const app = express()
app.use(cors())
app.use(express.json())

const wss = new WebSocketServer({ port: 8081 })

wss.on('connection', (ws) => {

    ws.on('message', async (message) => {
        const { content, userId } = JSON.parse(message.toString())
        
        const msg = await prisma.message.create({
            data: {
                content: content,
                userId: parseInt(userId),
            }
        })

        const user = await prisma.user.findFirstOrThrow({
            where: {
                id: parseInt(userId),
            }
        })

        const jsonMessage = JSON.parse(message.toString())
        jsonMessage.email = user.email
        jsonMessage.id = msg.id
        console.log(jsonMessage)

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(jsonMessage))
            }
        })
    })
})


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                email: email,
            },
        });

        if (user.password == password) {
            res.status(200).json({
                userId: user.id
            })
        } else {
            res.status(404).json({
                error: "Senha incorreta"
            })
        }
    } catch (e) {
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: password,
            },
        });
        res.status(201).json({
            userId: newUser.id
        })
    }
})

app.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                id: parseInt(userId),
            },
        });
        res.status(200).json({
            userId: user.id,
            email: user.email,
        })
    } catch (e) {
        res.status(404).json({
            error: "Usuário não encontrado"
        })
    }
})

app.get('/messages', async (req, res) => {
    const messages = await prisma.message.findMany({});
    let messagesWithUser = []
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const user = await prisma.user.findFirstOrThrow({
            where: {
                id: message.userId,
            },
        });
        messagesWithUser.push({
            id: message.id,
            content: message.content,
            email: user.email,
            userId: user.id,
        })
    }
    res.status(200).json(messagesWithUser)
})

app.listen(8080)