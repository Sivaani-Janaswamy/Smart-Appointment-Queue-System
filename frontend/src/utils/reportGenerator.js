import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateWeeklyReportPDF = (analyticsData) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Weekly Queue Performance Report', 14, 22);
  doc.setFontSize(12);
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, 30);

  doc.autoTable({
    startY: 40,
    head: [['Day', 'Tokens Served', 'Average Wait Time (min)']],
    body: analyticsData.map(item => [
      item.name,
      item['Tokens Served'],
      item['Avg Wait (min)'],
    ]),
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 175] }, // primary-dark blue
  });

  doc.save('weekly-queue-report.pdf');
};
