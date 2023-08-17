import express from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors';

const prisma = new PrismaClient()
const app = express()
app.use(cors())
app.use(express.json())
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
                token: user.email
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
            token: newUser.email
        })
    }
})

app.listen(8080)