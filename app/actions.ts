"use server";

import prisma from "@/lib/prisma";

export const checkAndAddUser = async (email: string, name: string) => {
	if (!email || !name) return;
	try {
		const existingUser = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});
		if (!existingUser) {
			await prisma.user.create({
				data: {
					email,
					name,
				},
			});
		}
		return existingUser;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
