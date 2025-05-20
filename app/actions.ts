"use server";

import prisma from "@/lib/prisma";
import { Invoice } from "@/type";
import { randomBytes } from "crypto";

export const checkAndAddUser = async (email: string, name: string) => {
	if (!email || !name) return;
	try {
		const existingUser = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (!existingUser) {
			return await prisma.user.create({
				data: {
					email,
					name,
				},
			});
		}
		return existingUser;
	} catch (error) {
		console.error("Erreur dans checkAndAddUser:", error);
		throw error;
	}
};

const generateUniqueId = async () => {
	let uniqueId = "";
	let isUnique = false;
	while (!isUnique) {
		uniqueId = randomBytes(3).toString("hex");
		const existingInvoice = await prisma.invoice.findUnique({
			where: {
				id: uniqueId,
			},
		});
		if (!existingInvoice) {
			isUnique = true;
		}
	}
	return uniqueId;
};

export async function createEmptyInvoice(email: string, name: string) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});
		const invoiceId = await generateUniqueId();
		if (user) {
			return await prisma.invoice.create({
				data: {
					id: invoiceId,
					name: name,
					userId: user?.id,
					issuerName: "",
					issuerAddress: "",
					clientName: "",
					clientAddress: "",
					invoiceDate: "",
					dueDate: "",
					vatActive: false,
					vatRate: 20,
				},
			});
		}
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getInvoiceByEmail(email: string) {
	if (!email) return null;
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
			include: {
				invoices: {
					include: {
						lines: true,
					},
				},
			},
		});
		if (user) {
			const today = new Date();
			const updatedInvoices = await Promise.all(
				user.invoices.map(async (invoice) => {
					const dueDate = new Date(invoice.dueDate);
					if (dueDate < today && invoice.status == 2) {
						const updatedInvoice = await prisma.invoice.update({
							where: {
								id: invoice.id,
							},
							data: {
								status: 5,
							},
							include: {
								lines: true,
							},
						});
						return updatedInvoice;
					}
					return invoice;
				})
			);
			return updatedInvoices;
		}
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getInvoiceById(invoiceId: string) {
	try {
		const invoice = await prisma.invoice.findUnique({
			where: {
				id: invoiceId,
			},
			include: {
				lines: true,
			},
		});
		if(!invoice) {
			throw new Error("Invoice not found");
		}
		return invoice;
	} catch (error) {
		console.error(error);
		
	}
}

export async function updateInvoice(invoice: Invoice) {
	try {
		const existingInvoice = await prisma.invoice.findUnique({
			where: {
				id: invoice.id,
			},
			include: {
				lines: true,
			},
		});
		if(!existingInvoice) {
			throw new Error(`Invoice with id ${invoice.id} not found`);
		}
		
		
	 } catch (error) {
		console.error(error);
		return null;
	}
}