import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
	const { email, password } = await readBody(event);
	const prisma = new PrismaClient();

	try {
		const banana = await prisma.user.findFirstOrThrow({
			where: {
				email: email,
			},
		});

		if (banana.password == password) {
			return email;
		} else {
			return false;
		}
	} catch (e) {
		await prisma.user.create({
			data: {
				email: email,
				password: password,
			},
		});
		return email;
	}
});
