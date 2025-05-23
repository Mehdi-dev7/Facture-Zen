import { Invoice, Totals } from "@/type";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { ArrowDownFromLine, Layers } from "lucide-react";
import { useRef } from "react";
import confetti from "canvas-confetti";
interface InvoicePDFProps {
	invoice: Invoice;
	totals: Totals;
}

export default function InvoicePDF({ invoice, totals }: InvoicePDFProps) {
	const formatDate = (dateString: string) => {
		const dateObj = new Date(dateString);
		const options: Intl.DateTimeFormatOptions = {
			day: "2-digit",
			month: "short",
			year: "numeric",
		};
		return dateObj.toLocaleDateString("fr-FR", options);
	};
  const factureRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    const element = factureRef.current;
    if (element) {
      try {
        const canvas = await html2canvas(element, {scale: 3, useCORS: true});
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`facture-${invoice.name}.pdf`);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 999,
        });
        
        
      } catch (error) {
        console.error("Erreur lors de la génération du PDF", error);
        
      }
  }}

	return (
		<div className="mt-4 hidden lg:block">
			<div className="border-base-300 border-2 border-dashed rounded-xl p-5">
				<button className="btn btn-accent mb-4" onClick={handleDownloadPDF}>
					Facture PDF <ArrowDownFromLine className="w-4" />
				</button>

				<div className="p-8" ref={factureRef}>
					<div className="flex justify-between items-center text-sm">
						<div className="flex flex-col">
							<div>
								<div className="flex items-center">
									<div className="bg-accent-content text-accent rounded-full p-2">
										<Layers className="w-6 h-6" />
									</div>
									<span className="ml-3 text-lg font-bold italic">
										Facture <span className="text-accent">Zen</span>
									</span>
								</div>
							</div>
							<h1 className="text-7xl font-bold uppercase">Facture</h1>
						</div>
						<div className="text-right uppercase">
							<p className="badge badge-ghost">Facture n° {invoice.id}</p>
							<p className="my-2">
								<strong>Date </strong>
								{formatDate(invoice.invoiceDate)}
							</p>
							<p className="my-2">
								<strong>Date d&apos;échéance </strong>
								{formatDate(invoice.dueDate)}
							</p>
						</div>
					</div>
					<div className="flex justify-between my-6">
            <div>
              <p className="badge badge-ghost mb-2">Emetteur</p>
              <p className="text-sm font-bold italic">{invoice.issuerName}</p>
              <p className="text-sm text-gray-500 w-52 break-words">{invoice.issuerAddress}</p>
            </div>
            <div className="text-right">
              <p className="badge badge-ghost mb-2">Client</p>
              <p className="text-sm font-bold italic">{invoice.clientName}</p>
              <p className="text-sm text-gray-500 w-52 break-words">{invoice.clientAddress}</p>
            </div>

					</div>
					<div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th></th>
                  <th>Description</th>
                  <th>Quantité</th>
                  <th>Prix unitaire</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {invoice.lines.map((ligne , index) => (
                  <tr key={index + 1}>
                    <td>{index + 1}</td>
                    <td>{ligne.description}</td>
                    <td>{ligne.quantity}</td>
                    <td>{ligne.unitPrice.toFixed(2)} €</td>
                    <td>{(ligne.unitPrice * ligne.quantity).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
          <div className="mt-6 space-y-2 text-md">
            <div className="flex justify-between">
              <div className="font-bold">Total HT</div>
              <div>{totals.totalHT.toFixed(2)} €</div>
            </div>
            {invoice.vatActive && (
              <div className="flex justify-between">
                <div className="font-bold">TVA {invoice.vatRate}%</div>
                <div>{totals.totalTTC.toFixed(2)} €</div>
              </div>
            )}
            <div className="flex justify-between">
              <div className="font-bold">Total TTC</div>
              <div className="font-bold border-b-3 border-amber-600">{totals.totalTTC.toFixed(2)} €</div>
            </div>

          </div>
				</div>
			</div>
		</div>
	);
}
