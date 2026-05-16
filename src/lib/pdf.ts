import { jsPDF } from 'jspdf';

/**
 * Generates a professional PDF version of the cover letter.
 */
export function generatePDF(letterText: string, jobTitle: string, company: string): Blob {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('GhostWrite — Secured Document', 20, 20);
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Job Info
  doc.setFontSize(12);
  doc.setTextColor(0);
  const subtitle = company ? `${jobTitle} — ${company}` : jobTitle;
  doc.text(subtitle, 20, 40);
  
  // Body text
  doc.setFontSize(11);
  const splitText = doc.splitTextToSize(letterText, 170);
  doc.text(splitText, 20, 55);
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text('Secured via GhostWrite | ghostwrite.dev', 20, pageHeight - 15);
  
  return doc.output('blob');
}

/**
 * Triggers a file download of the provided Blob.
 */
export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
