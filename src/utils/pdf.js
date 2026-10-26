import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDF = (titulo, cabeceras, filas, nombreArchivo) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(titulo, 14, 20);
    doc.setFontSize(10);
    doc.text(
        `Fecha: ${new Date().toLocaleDateString("es-ES")}`,
        14,
        28
    );
    autoTable(doc, {
        startY: 35,
        head: [cabeceras],
        body: filas,
        styles: {
            fontSize: 9,
            cellPadding: 3
        },
        headStyles: {
            fillColor: [30, 201, 164]
        }
    });
    doc.save(nombreArchivo);
};