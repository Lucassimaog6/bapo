import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
    const { content, userId } = await readBody(event)
	const prisma = new PrismaClient();
    
    try {
        await prisma.message.create({
            data: {
                content: content,
                userId: userId
            }
        })
        return true
    } catch(e) {
        return e;
    }
});