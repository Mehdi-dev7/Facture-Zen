"use client";

import { getInvoiceById, updateInvoice } from "@/app/actions";
import InvoiceInfo from "@/app/components/InvoiceInfo";
import InvoiceLines from "@/app/components/InvoiceLines";
import VATControl from "@/app/components/VATControl";
import Wrapper from "@/app/components/Wrapper";
import { Invoice, Totals } from "@/type";
import { ChevronDown, Save, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function Page({
	params,
}: {
	params: Promise<{ invoiceId: string }>;
}) {
	const [invoice, setInvoice] = useState<Invoice | null>(null);
	const [initialInvoice, setInitialInvoice] = useState<Invoice | null>(null);
	const [totals, setTotals] = useState<Totals | null>(null);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	const fetchInvoice = useCallback(async () => {
		try {
			const { invoiceId } = await params;
			const fetchInvoice = await getInvoiceById(invoiceId);
			if (fetchInvoice) {
				setInvoice(fetchInvoice);
				setInitialInvoice(fetchInvoice);
			}
		} catch (error) {
			console.error(error);
		}
	}, [params]);

	useEffect(() => {
		fetchInvoice();
	}, [fetchInvoice]);

	useEffect(() => {
		if (!invoice) return;
		const ht = invoice.lines.reduce(
			(acc, { quantity, unitPrice }) => acc + quantity * unitPrice,
			0
		);
		const vat = invoice.vatRate ? ht * (invoice.vatRate / 100) : 0;
		setTotals({ totalHT: ht, totalVAT: vat, totalTTC: ht + vat });
	}, [invoice]);

	useEffect(() => {
		setIsDisabled(JSON.stringify(invoice) === JSON.stringify(initialInvoice));
		}
	, [invoice, initialInvoice]);

	const handleStatusChange = (status: number) => {
		if (invoice) {
			const updateInvoice = {
				...invoice,
				status,
			};
			setInvoice(updateInvoice);
		}
	};

	const handleSave = async () => {
		if (!invoice) return;
		setIsLoading(true);
		try {
			await updateInvoice(invoice);
			const updatedInvoice = await getInvoiceById(invoice.id);
			if (updatedInvoice) {
				setInvoice(updatedInvoice);
				setInitialInvoice(updatedInvoice);
			}
			setIsLoading(false);
		} catch (error) {
			console.error("Erreur lors de la sauvegarde de la facture", error);
		}
	}

	if (!invoice || !totals)
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="text-2xl font-bold">Facture non trouvée</div>
			</div>
		);
	console.log(invoice);
	return (
		<Wrapper>
			<div>
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<p className="badge badge-ghost badge-lg uppercase">
						<span>Facture-</span>
						{invoice?.id}
					</p>

					<div className="flex items-center gap-2">
						<div className="dropdown">
							<div
								tabIndex={0}
								role="button"
								className="btn m-1 w-56 flex items-center justify-between"
							>
								{invoice?.status === 1 && "Brouillon"}
								{invoice?.status === 2 && "En attente"}
								{invoice?.status === 3 && "Payée"}
								{invoice?.status === 4 && "Annulée"}
								{invoice?.status === 5 && "Impayée"}
								<ChevronDown className="w-4 h-4" />
							</div>
							<ul
								tabIndex={0}
								className="dropdown-content menu bg-base-200 rounded-box z-1 w-56 p-2 shadow-sm ml-1"
							>
								<li>
									<a onClick={() => handleStatusChange(1)}>Brouillon</a>
								</li>
								<li>
									<a onClick={() => handleStatusChange(2)}>En attente</a>
								</li>
								<li>
									<a onClick={() => handleStatusChange(3)}>Payée</a>
								</li>
								<li>
									<a onClick={() => handleStatusChange(4)}>Annulée</a>
								</li>
								<li>
									<a onClick={() => handleStatusChange(5)}>Impayée</a>
								</li>
							</ul>
						</div>
						<button className="btn btn-sm btn-accent" disabled={isDisabled || isLoading} onClick={handleSave}>
							{isLoading ? (<span className="loading loading-spinner loading-sm"></span>) : (
								<>Sauvegarder
									<Save className="w-4 ml-2" />
								</>
							)}
						</button>
						<button className="btn btn-sm btn-accent">
							<Trash />
						</button>
					</div>
				</div>

				<div className="flex flex-col lg:flex-row w-full">
					<div className="flex w-full lg:w-[37%] flex-col">
						<div className="mb-4 bg-base-200 p-4 rounded-xl">
							<div className="flex items-center justify-between mb-4">
								<div className="badge badge-accent">Résumé des totaux</div>
								<VATControl invoice={invoice} setInvoice={setInvoice} />
							</div>

							<div className="flex items-center justify-between">
								<span>Total HT</span>
								<span>{totals.totalHT.toFixed(2)} €</span>
							</div>

							<div className="flex items-center justify-between">
								<span>
									TVA {invoice?.vatActive ? `${invoice?.vatRate}` : "0"}%
								</span>
								<span>{totals.totalVAT.toFixed(2)} €</span>
							</div>

							<div className="flex items-center justify-between font-bold">
								<span>Total TTC</span>
								<span>{totals.totalTTC.toFixed(2)} €</span>
							</div>
						</div>
						<InvoiceInfo invoice={invoice} setInvoice={setInvoice} />
					</div>
					<div className="flex w-full lg:w-[63%] flex-col  lg:ml-4">
						<InvoiceLines invoice={invoice} setInvoice={setInvoice} />
					</div>
				</div>
			</div>
		</Wrapper>
	);
}
