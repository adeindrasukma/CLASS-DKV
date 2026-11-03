import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student } from '../types';

export function exportStudentsToExcel(students: Student[], className = 'XII DKV', year = '2026/2027') {
  // Construct 2-tier header structure matching original sheet + status pendidikan
  const wsData: any[][] = [];

  // Title rows
  wsData.push([`BIODATA KELAS ${className.toUpperCase()} ${year.replace('/', '_')}`]);
  wsData.push([`Update per: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}`]);
  wsData.push([]); // blank line

  // Header Row 1
  const headerRow1 = [
    'NO',
    'NAMA',
    'TEMPAT LAHIR',
    'TANGGAL LAHIR',
    'ALAMAT',
    'NO HANDPHONE / WHATSAPP',
    'NAMA WALI',
    'NO HANDPHONE / WHATSAPP WALI',
    'JUMLAH SAUDARA',
    'NAMA SAUDARA', '', '', '', '',
    'STATUS PENDIDIKAN SAUDARA', '', '', '', '',
    'TEMPAT PENDIDIKAN SAUDARA SAAT INI', '', '', '', '',
  ];
  wsData.push(headerRow1);

  // Header Row 2
  const headerRow2 = [
    '', '', '', '', '', '', '', '', '',
    '(1)', '(2)', '(3)', '(4)', '(5)',
    '(1)', '(2)', '(3)', '(4)', '(5)',
    '(1)', '(2)', '(3)', '(4)', '(5)',
  ];
  wsData.push(headerRow2);

  // Fill student rows
  students.forEach((s) => {
    const s1 = s.saudara?.[0] || { nama: '', statusPendidikan: '', tempatPendidikan: '' };
    const s2 = s.saudara?.[1] || { nama: '', statusPendidikan: '', tempatPendidikan: '' };
    const s3 = s.saudara?.[2] || { nama: '', statusPendidikan: '', tempatPendidikan: '' };
    const s4 = s.saudara?.[3] || { nama: '', statusPendidikan: '', tempatPendidikan: '' };
    const s5 = s.saudara?.[4] || { nama: '', statusPendidikan: '', tempatPendidikan: '' };

    const row = [
      s.no,
      s.nama.toUpperCase(),
      s.tempatLahir || '-',
      s.tanggalLahir || '-',
      s.alamat || '-',
      s.noHp || '-',
      s.namaWali || '-',
      s.noHpWali || '-',
      s.jumlahSaudara ?? 0,
      s1.nama || '', s2.nama || '', s3.nama || '', s4.nama || '', s5.nama || '',
      s1.statusPendidikan || '', s2.statusPendidikan || '', s3.statusPendidikan || '', s4.statusPendidikan || '', s5.statusPendidikan || '',
      s1.tempatPendidikan || '', s2.tempatPendidikan || '', s3.tempatPendidikan || '', s4.tempatPendidikan || '', s5.tempatPendidikan || '',
    ];
    wsData.push(row);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Define merges for top headers
  ws['!merges'] = [
    // Title
    { s: { r: 0, c: 0 }, e: { r: 0, c: 23 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 23 } },
    // Row 3 (index 3) headers vertical merges
    { s: { r: 3, c: 0 }, e: { r: 4, c: 0 } }, // NO
    { s: { r: 3, c: 1 }, e: { r: 4, c: 1 } }, // NAMA
    { s: { r: 3, c: 2 }, e: { r: 4, c: 2 } }, // TEMPAT LAHIR
    { s: { r: 3, c: 3 }, e: { r: 4, c: 3 } }, // TANGGAL LAHIR
    { s: { r: 3, c: 4 }, e: { r: 4, c: 4 } }, // ALAMAT
    { s: { r: 3, c: 5 }, e: { r: 4, c: 5 } }, // NO HP
    { s: { r: 3, c: 6 }, e: { r: 4, c: 6 } }, // NAMA WALI
    { s: { r: 3, c: 7 }, e: { r: 4, c: 7 } }, // NO HP WALI
    { s: { r: 3, c: 8 }, e: { r: 4, c: 8 } }, // JUMLAH SAUDARA
    // Horizontal merges for saudara groups
    { s: { r: 3, c: 9 }, e: { r: 3, c: 13 } },  // NAMA SAUDARA (1-5)
    { s: { r: 3, c: 14 }, e: { r: 3, c: 18 } }, // STATUS PENDIDIKAN SAUDARA (1-5)
    { s: { r: 3, c: 19 }, e: { r: 3, c: 23 } }, // TEMPAT PENDIDIKAN SAUDARA (1-5)
  ];

  // Set column widths
  ws['!cols'] = [
    { wch: 6 },  // NO
    { wch: 28 }, // NAMA
    { wch: 18 }, // TEMPAT LAHIR
    { wch: 15 }, // TGL LAHIR
    { wch: 35 }, // ALAMAT
    { wch: 20 }, // NO HP
    { wch: 24 }, // NAMA WALI
    { wch: 20 }, // NO HP WALI
    { wch: 15 }, // JUMLAH SAUDARA
    { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, // NAMA SAUDARA 1-5
    { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, // STATUS PENDIDIKAN 1-5
    { wch: 24 }, { wch: 24 }, { wch: 24 }, { wch: 24 }, { wch: 24 }, // TEMPAT PENDIDIKAN 1-5
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `BIODATA_${className.replace(/\s+/g, '_')}`);
  XLSX.writeFile(wb, `BIODATA_KELAS_${className.replace(/\s+/g, '_')}_${year.replace('/', '_')}.xlsx`);
}

export function exportStudentsToPdf(students: Student[], className = 'XII DKV', year = '2026/2027') {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Header Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`LAPORAN BIODATA SISWA KELAS ${className.toUpperCase()}`, 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tahun Ajaran: ${year} • Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}`, 14, 21);
  doc.text(`Total Siswa: ${students.length} orang | Lengkap: ${students.filter(s => s.isCompleted).length} orang`, 14, 26);

  // Table Data
  const tableData = students.map((s) => {
    // Format siblings into readable multi-line summary
    const siblingsSummary = (s.saudara || [])
      .filter((sib) => sib.nama && sib.nama.trim() !== '')
      .map((sib, i) => `${i + 1}. ${sib.nama} (${sib.statusPendidikan || '-'}${sib.tempatPendidikan ? ' - ' + sib.tempatPendidikan : ''})`)
      .join('\n');

    return [
      s.no,
      s.nama,
      `${s.tempatLahir || '-'}\n${s.tanggalLahir || '-'}`,
      s.alamat || '-',
      s.noHp || '-',
      `${s.namaWali || '-'}\n(WA: ${s.noHpWali || '-'})`,
      s.jumlahSaudara ?? 0,
      siblingsSummary || '(Tidak ada)',
    ];
  });

  autoTable(doc, {
    startY: 31,
    head: [[
      'No',
      'Nama Siswa',
      'Tempat / Tgl Lahir',
      'Alamat',
      'No HP / WA',
      'Nama Wali / No HP',
      'Jml Sdr',
      'Rincian Saudara & Status Pendidikan Saat Ini',
    ]],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 138], // Indigo 900
      textColor: [255, 255, 255],
      fontSize: 8,
      halign: 'center',
      valign: 'middle',
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      valign: 'top',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, // No
      1: { cellWidth: 35, fontStyle: 'bold' }, // Nama
      2: { cellWidth: 30 }, // TTL
      3: { cellWidth: 42 }, // Alamat
      4: { cellWidth: 26 }, // No HP
      5: { cellWidth: 35 }, // Wali
      6: { cellWidth: 14, halign: 'center' }, // Jml
      7: { cellWidth: 78 }, // Saudara
    },
    margin: { left: 10, right: 10 },
    didDrawPage: (data) => {
      // Footer page numbering
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Halaman ${data.pageNumber} dari ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 8
      );
    },
  });

  doc.save(`LAPORAN_BIODATA_KELAS_${className.replace(/\s+/g, '_')}_${year.replace('/', '_')}.pdf`);
}

export function printSingleStudentBiodata(student: Student, className = 'XII DKV', year = '2026/2027') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Border & Header
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 277);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FORMULIR BIODATA SISWA', 105, 22, { align: 'center' });
  doc.setFontSize(11);
  doc.text(`KELAS ${className.toUpperCase()} • TAHUN AJARAN ${year}`, 105, 29, { align: 'center' });
  doc.setLineWidth(0.3);
  doc.line(20, 34, 190, 34);

  let y = 44;
  const leftX = 22;
  const valueX = 75;

  const addField = (label: string, value: string | number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(label, leftX, y);
    doc.text(':', valueX - 3, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value || '-'), valueX, y);
    y += 7;
  };

  // Section 1: Data Siswa
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text('A. DATA PRIBADI SISWA', leftX, y);
  doc.setTextColor(0, 0, 0);
  y += 6;

  addField('Nomor Absen', student.no);
  addField('Nama Lengkap', student.nama);
  addField('Tempat Lahir', student.tempatLahir);
  addField('Tanggal Lahir', student.tanggalLahir);
  addField('Alamat Tinggal', student.alamat);
  addField('No. HP / WhatsApp Siswa', student.noHp);

  y += 4;
  // Section 2: Data Orang Tua / Wali
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text('B. DATA ORANG TUA / WALI', leftX, y);
  doc.setTextColor(0, 0, 0);
  y += 6;

  addField('Nama Wali / Orang Tua', student.namaWali);
  addField('No. HP / WhatsApp Wali', student.noHpWali);

  y += 4;
  // Section 3: Data Saudara
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text('C. DATA SAUDARA KANDUNG', leftX, y);
  doc.setTextColor(0, 0, 0);
  y += 6;

  addField('Jumlah Saudara', `${student.jumlahSaudara || 0} orang`);

  // Siblings table
  y += 2;
  const siblingRows = (student.saudara || []).map((sib, i) => [
    i + 1,
    sib.nama || '-',
    sib.statusPendidikan || '-',
    sib.tempatPendidikan || '-',
  ]);

  autoTable(doc, {
    startY: y,
    head: [['No', 'Nama Saudara', 'Status Pendidikan Saat Ini', 'Tempat Pendidikan / Sekolah']],
    body: siblingRows,
    theme: 'grid',
    headStyles: {
      fillColor: [71, 85, 105],
      fontSize: 8.5,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 50 },
      2: { cellWidth: 55 },
      3: { cellWidth: 55 },
    },
    margin: { left: leftX, right: 20 },
  });

  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 20 : y + 60;

  // Signatures
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Mengetahui,', 30, finalY);
  doc.text('Orang Tua / Wali Siswa', 30, finalY + 5);
  doc.text('( ........................................ )', 30, finalY + 28);

  doc.text(`.................., ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}`, 130, finalY);
  doc.text('Siswa yang Bersangkutan,', 130, finalY + 5);
  doc.text(`( ${student.nama.toUpperCase()} )`, 130, finalY + 28);

  doc.save(`BIODATA_${student.no}_${student.nama.replace(/\s+/g, '_')}.pdf`);
}
