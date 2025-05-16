"use client";

import { Layers } from "lucide-react";
import { useEffect, useState } from "react";
import Wrapper from "./components/Wrapper";
import { createEmptyInvoice, getInvoiceByEmail } from "./actions";
import { useUser } from "@clerk/nextjs";
import confetti from "canvas-confetti";
import { Invoice } from "@/type";

export default function Home() {
	const {user} = useUser();
	const [invoiceName, setInvoiceName] = useState("");
	const [isNameValid, setIsNameValid] = useState(true);
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const email = user?.primaryEmailAddress?.emailAddress as string;


	const fetchInvoices = async () => {
		try {
			const data = await getInvoiceByEmail(email);
			if(data){
				setInvoices(data);
			}
		} catch (error) {
			console.error("Erreur lors de la récupération des factures", error);
		}
	}

	useEffect(() => {
		fetchInvoices();
	}, [email]);

	useEffect(() => {
		setIsNameValid(invoiceName.length <= 60);
	}, [invoiceName]);

	const handleCreateInvoice = async () => {
		try {
			if(email){
				await createEmptyInvoice(email, invoiceName);
				setInvoiceName("");
				const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
				if(modal){
					modal.close();
				}
			}

			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
				zIndex: 999,
			});
		} catch (error) {
			console.error("Erreur lors de la création de la facture", error);
		}
	}

	return (
		<Wrapper>
			<div className="flex flex-col space-y-4">
				<h1 className="text-lg font-bold">Mes Factures</h1>
				<div className="grid md:grid-cols-3 gap-4">
					<div
						className="cursor-pointer border border-accent rounded-xl flex flex-col justify-center items-center p-5 "
						onClick={() => {
							const modal = document.getElementById(
								"my_modal_3"
							) as HTMLDialogElement;
							if (modal) {
								modal.showModal();
							}
						}}
					>
						<div className="font-bold text-accent">Créer une facture</div>
						<div className="bg-accent-content text-accent rounded-full p-2 mt-2">
							<Layers className="w-6 h-6" />
						</div>
					</div>
					{/* TODO: Afficher les factures */}
				</div>

				<dialog id="my_modal_3" className="modal">
					<div className="modal-box">
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
								✕
							</button>
						</form>
						<h3 className="font-bold text-lg">Nouvelle facture</h3>
						<input
							type="text"
							placeholder="Nom de la facture (max 60 caractères)"
							className="input input-bordered w-full my-4"
							value={invoiceName}
							onChange={(e) => setInvoiceName(e.target.value)}
						/>

						{!isNameValid && (
							<p className="text-red-500 text-sm m-4">
								Le nom ne peut pas dépasser 60 caractères
							</p>
						)}
						<button
							className="btn btn-accent"
							disabled={!isNameValid || invoiceName.length === 0}
							onClick={handleCreateInvoice}
						>
							Créer
						</button>
					</div>
				</dialog>
			</div>
		</Wrapper>
	);
}
