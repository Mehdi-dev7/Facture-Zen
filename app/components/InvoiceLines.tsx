import { Invoice } from "@/type";
import { InvoiceLine } from "@prisma/client";
import { Plus, Trash } from "lucide-react";
interface Props {
	invoice: Invoice;
	setInvoice: (invoice: Invoice) => void;
}

export default function InvoiceLines({ invoice, setInvoice }: Props) {
	const handleAddLine = () => {
		const newLine: InvoiceLine = {
			id: `${Date.now()}`,
			description: "",
			quantity: 1,
			unitPrice: 0,
			invoiceId: invoice.id,
		};
		setInvoice({
			...invoice,
			lines: [...invoice.lines, newLine],
		});
	};
	const handleQuantityChange = (index: number, value: string) => {
		const updateLines = [...invoice.lines];
		updateLines[index].quantity =
			value === "" || value === "0" ? 0 : parseInt(value);
		setInvoice({
			...invoice,
			lines: updateLines,
		});
	};
	const handleQuantityFocus = (
		index: number,
		e: React.FocusEvent<HTMLInputElement>
	) => {
		if (e.target.value === "0") {
			e.target.value = "";
		}
	};
	const handleDescriptionChange = (index: number, value: string) => {
		const updateLines = [...invoice.lines];
		updateLines[index].description = value;
		setInvoice({
			...invoice,
			lines: updateLines,
		});
	};
	const handleUnitPriceChange = (index: number, value: string) => {
		const updateLines = [...invoice.lines];
		updateLines[index].unitPrice =
			value === "" || value === "0" ? 0 : parseFloat(value);
		setInvoice({
			...invoice,
			lines: updateLines,
		});
	};

	const handleUnitPriceFocus = (
		index: number,
		e: React.FocusEvent<HTMLInputElement>
	) => {
		if (e.target.value === "0") {
			e.target.value = "";
		}
	};

	const handleDeleteLine = (index: number) => {
		const updateLines = [...invoice.lines];
		updateLines.splice(index, 1);
		setInvoice({
			...invoice,
			lines: updateLines,
		});
	};
	// console.log(invoice.lines);
	return (
		<div className="h-fit bg-base-200 p-5 rounded-xl w-full">
			<div className="flex justify-between items-center mb-4">
				<h2 className="badge badge-accent">Produits / Services</h2>
				<button className="btn btn-sm btn-accent" onClick={handleAddLine}>
					<Plus className="w-4 " />
				</button>
			</div>
			<div className="scrollable">
				<table className="table w-full">
					<thead className="uppercase">
						<tr>
							<th>Quantité</th>
							<th>Description</th>
							<th>Prix unitaire (HT)</th>
							<th>Montant (HT)</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{invoice.lines.map((line, index) => (
							<tr key={line.id}>
								<td>
									<input
										type="number"
										value={line.quantity === 0 ? "" : line.quantity}
										className="input input-sm input-bordered w-full"
										min={0}
										onFocus={(e) => handleQuantityFocus(index, e)}
										onChange={(e) =>
											handleQuantityChange(index, e.target.value)
										}
									/>
								</td>
								<td>
									<input
										type="text"
										value={line.description}
										className="input input-sm input-bordered w-full"
										min={0}
										onChange={(e) =>
											handleDescriptionChange(index, e.target.value)
										}
									/>
								</td>
								<td>
									<input
										type="number"
										value={line.unitPrice === 0 ? "" : line.unitPrice}
										className="input input-sm input-bordered w-full"
										min={0}
										step={0.01}
										onFocus={(e) => handleUnitPriceFocus(index, e)}
										onChange={(e) =>
											handleUnitPriceChange(index, e.target.value)
										}
									/>
								</td>
								<td className="font-bold">
									{(line.quantity * line.unitPrice).toFixed(2)}€
								</td>
								<td>
									<button
										className="btn btn-sm btn-error btn-circle"
										onClick={() => handleDeleteLine(index)}
									>
										<Trash className="w-4 " />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
