"use client";

import { getInvoiceById } from "@/app/actions";
import InvoiceInfo from "@/app/components/InvoiceInfo";
import InvoiceLines from "@/app/components/InvoiceLines";
import VATControl from "@/app/components/VATControl";
import Wrapper from "@/app/components/Wrapper";
import { Invoice } from "@/type";
import { ChevronDown, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function Page({
	params,
}: {
	params: Promise<{ invoiceId: string }>;
}) {
	const [invoice, setInvoice] = useState<Invoice | null>(null);
	const [initialInvoice, setInitialInvoice] = useState<Invoice | null>(null);

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

	if (!invoice) return <div className="flex justify-center items-center h-screen">Facture non trouvée</div>;

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
							<div tabIndex={0} role="button" className="btn m-1 w-56 flex items-center justify-between">
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
									<a href="">Brouillon</a>
								</li>
								<li>
									<a href="">En attente</a>
								</li>
								<li>
									<a href="">Payée</a>
								</li>
								<li>
									<a href="">Annulée</a>
								</li>
								<li>
									<a href="">Impayée</a>
								</li>
							</ul>
						</div>
						<button className="btn btn-sm btn-accent">Sauvergarder</button>
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
