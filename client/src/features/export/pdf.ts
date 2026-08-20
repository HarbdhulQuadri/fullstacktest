import type { User } from '../users/types';
import { userToFormValues } from '../users/types';

export async function exportUserPdf(user: User): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const v = userToFormValues(user);
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;

  let y = margin;

  const ensure = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Header bar
  doc.setFillColor(49, 46, 129);
  doc.rect(0, 0, pageW, 90, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(`${v.userInfo.firstName} ${v.userInfo.lastName}`, margin, 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(v.userInfo.occupation || '—', margin, 64);
  y = 120;

  const line = (label: string, value: string) => {
    ensure(18);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`${label}:`, margin, y);
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'normal');
    doc.text(value || '—', margin + 70, y);
    y += 18;
  };

  const sectionTitle = (title: string) => {
    ensure(34);
    y += 6;
    doc.setTextColor(49, 46, 129);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(title, margin, y);
    y += 6;
    doc.setDrawColor(210, 210, 210);
    doc.line(margin, y, pageW - margin, y);
    y += 18;
  };

  sectionTitle('Personal');
  line('Date of Birth', v.userInfo.dob);
  line('Gender', v.userInfo.gender);

  sectionTitle('Contact');
  line('Email', v.userContact.email);
  line('Phone', v.userContact.phoneNumber);
  if (v.userContact.fax) line('Fax', v.userContact.fax);
  if (v.userContact.linkedInUrl) line('LinkedIn', v.userContact.linkedInUrl);

  sectionTitle('Address');
  line('Street', v.userAddress.address);
  line('City', v.userAddress.city);
  line('State', v.userAddress.state);
  line('Country', v.userAddress.country);
  line('Zip Code', v.userAddress.zipCode);

  sectionTitle('Education');
  if (v.userAcademics.length === 0) {
    line('', 'No education records.');
  }
  v.userAcademics.forEach((a) => {
    ensure(64);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text(`• ${a.schoolName}`, margin, y);
    y += 16;
    const detail = [a.degree, a.fieldOfStudy].filter(Boolean).join(' · ');
    if (detail) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(detail, margin + 14, y);
      y += 16;
    }
    const dates = [a.startDate, a.endDate].filter(Boolean).join(' — ');
    if (dates) {
      doc.setTextColor(120, 120, 120);
      doc.text(dates, margin + 14, y);
      y += 16;
    }
    if (a.description) {
      doc.setTextColor(60, 60, 60);
      doc.text(a.description, margin + 14, y);
      y += 16;
    }
    y += 6;
  });

  const safe = `${v.userInfo.firstName}-${v.userInfo.lastName}`.replace(/\s+/g, '');
  doc.save(`resume-${safe}.pdf`);
}
