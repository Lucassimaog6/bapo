import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
	const { email, password } = await readBody(event);
	const prisma = new PrismaClient();

	try {
		const user = await prisma.user.findFirstOrThrow({
			where: {
				email: email,
			},
		});

		if (user.password == password) {
			return user.id;
		} else {
			return false;
		}
	} catch (e) {
		const newUser = await prisma.user.create({
			data: {
				email: email,
				password: password,
			},
		});
		return newUser.id;
	}
});
