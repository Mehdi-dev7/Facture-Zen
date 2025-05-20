import { Invoice } from "@/type";
import {
	CheckCircle,
	Clock,
	FileText,
	SquareArrowOutUpRight,
	XCircle,
} from "lucide-react";
import Link from "next/link";

type InvoiceComponentProps = {
	invoice: Invoice;
	index: number;
};

const getStatusBadge = (status: number) => {
	switch (status) {
		case 1:
			return (
				<div className="badge badge-lg flex items-center gap-2">
					<FileText className="w-4" /> Brouillon
				</div>
			);
		case 2:
			return (
				<div className="badge badge-lg badge-warning flex items-center gap-2">
					<Clock className="w-4" /> En attente
				</div>
			);
		case 3:
			return (
				<div className="badge badge-lg badge-success flex items-center gap-2">
					<CheckCircle className="w-4" />
					Payée
				</div>
			);
		case 4:
			return (
				<div className="badge badge-lg badge-info flex items-center gap-2">
					<XCircle className="w-4" /> Annulée
				</div>
			);
		case 5:
			return (
				<div className="badge badge-lg badge-error flex items-center gap-2">
					<XCircle className="w-4" /> Impayée
				</div>
			);
		default:
			return (
				<div className="badge badge-lg flex items-center gap-2">
					<XCircle className="w-4" /> Indéfini
				</div>
			);
	}
};

export default function InvoiceComponent({
	invoice,
	
}: InvoiceComponentProps) {
	const calculateTotal = (invoice: Invoice) => {
		const totalHT = invoice?.lines?.reduce((acc, line) => {
			const quantity = line.quantity ?? 0;
			const unitPrice = line.unitPrice ?? 0;
			return acc + quantity * unitPrice;
		}, 0);

		const totalVAT = totalHT * (invoice.vatRate / 100);
		return totalHT + totalVAT;
	};

	return (
		<div className="bg-base-200/90 p-5 rounded-xl space-y-2 shadow">
			<div className="flex justify-between items-center w-full">
				<div>{getStatusBadge(invoice.status)}</div>
				<Link className="btn btn-accent btn-sm" href={`/invoice/${invoice.id}`}>
					Plus <SquareArrowOutUpRight className="w-4" />
				</Link>
			</div>
			<div className="w-full">
				<div>
					<div className="">
          <div className="uppercase stat-action font-semibold text-md">{invoice.name}</div>
						<div className="stat-desc uppercase ">FACT-{invoice.id}</div>
					</div>
					<div>
						<div className="stat-value">{calculateTotal(invoice).toFixed(2)}€</div>
					</div>
				</div>
			</div>
		</div>
	);
}
