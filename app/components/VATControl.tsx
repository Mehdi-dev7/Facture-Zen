import { Invoice } from "@/type";

interface Props {
	invoice: Invoice;
	setInvoice: (invoice: Invoice) => void;
}

export default function VATControl({ invoice, setInvoice }: Props) {

  const handleVatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoice({...invoice, vatActive: e.target.checked, vatRate: e.target.checked ? invoice.vatRate : 0});
  }

  const handleVatRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoice({...invoice, vatRate: parseFloat(e.target.value)});
  }


  return (
		<div className="flex items-center mt-1 ml-2">
			<label htmlFor="" className="block text-sm font-bold ">
				TVA (%)
			</label>
			<input
				type="checkbox"
				className="toggle toggle-sm ml-2 "
        onChange={handleVatChange}
				checked={invoice.vatActive}
			/>
      {invoice.vatActive && (
        <input type="number"
        value={invoice.vatRate}
        className="input input-sm input-bordered w-16 h-6 ml-2"
        onChange={handleVatRateChange}
        min={0}
        max={100}
        />
      )}
		</div>
	);
}
