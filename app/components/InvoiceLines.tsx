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
    }
    setInvoice({
      ...invoice,
      lines: [...invoice.lines, newLine],
    });
  }
  
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
						<th>Quantité</th>
						<th>Description</th>
						<th>Prix unitaire (HT)</th>
						<th>Montant (HT)</th>
						<th></th>
					</thead>
					<tbody>
						{invoice.lines.map((line, index) => (
							<tr key={line.id}>
								<td>
									<input
										type="number"
										value={line.quantity}
										className="input input-sm input-bordered w-full"
										min={0}
									/>
								</td>
								<td>
									<input
										type="text"
										value={line.description}
                    className="input input-sm input-bordered w-full"
										min={0}
									/>
								</td>
								<td>
									<input
										type="number"
										value={line.unitPrice}
										className="input input-sm input-bordered w-full"
										min={0}
										step={0.01}
									/>
								</td>
								<td className="font-bold">
									{(line.quantity * line.unitPrice).toFixed(2)}€
								</td>
								<td>
									<button className="btn btn-sm btn-error btn-circle">
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
