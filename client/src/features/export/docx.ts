import type { User } from '../users/types';
import { userToFormValues } from '../users/types';

/**
 * DOCX content mirrors the `ResumeTemplate` preview: same section order and
 * labels (Contact, Address, Personal, Education). A Word document can't be a
 * pixel-perfect copy of the styled HTML preview, but the exported content now
 * matches what the user sees.
 */
export async function exportUserDocx(user: User): Promise<void> {
  const [{ Document, Packer, Paragraph, TextRun, HeadingLevel }, { saveAs }] =
    await Promise.all([import('docx'), import('file-saver')]);
  const v = userToFormValues(user);

  const heading = (text: string) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text, color: '312E81' })],
    });

  const line = (text?: string | null) =>
    new Paragraph({ children: [new TextRun({ text: text || '' })] });

  const kv = (label: string, value?: string | null) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true }),
        new TextRun({ text: value || '—' }),
      ],
    });

  const children = [
    new Paragraph({
      children: [
        new TextRun({ text: `${v.userInfo.firstName} ${v.userInfo.lastName}`, bold: true, size: 32 }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: v.userInfo.occupation || '—', italics: true })],
    }),

    heading('Contact'),
    kv('Email', v.userContact.email),
    kv('Phone', v.userContact.phoneNumber),
    ...(v.userContact.fax ? [kv('Fax', v.userContact.fax)] : []),
    ...(v.userContact.linkedInUrl ? [kv('LinkedIn', v.userContact.linkedInUrl)] : []),

    heading('Address'),
    line(v.userAddress.address),
    line(`${v.userAddress.city}, ${v.userAddress.state} ${v.userAddress.zipCode}`),
    line(v.userAddress.country),

    heading('Personal'),
    kv('DOB', v.userInfo.dob),
    kv('Gender', v.userInfo.gender),

    heading('Education'),
    ...(v.userAcademics.length === 0
      ? [line('No education records.')]
      : v.userAcademics
          .map((a) => {
            const runs = [new TextRun({ text: a.schoolName, bold: true })];
            const detail = [a.degree, a.fieldOfStudy].filter(Boolean).join(' · ');
            if (detail) runs.push(new TextRun({ text: ` — ${detail}` }));
            const paras = [new Paragraph({ children: runs })];
            const dates = [a.startDate, a.endDate].filter(Boolean).join(' — ');
            if (dates) {
              paras.push(
                new Paragraph({ children: [new TextRun({ text: dates, color: '808080' })] }),
              );
            }
            if (a.description) {
              paras.push(new Paragraph({ children: [new TextRun({ text: a.description })] }));
            }
            return paras;
          })
          .flat()),
  ];

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const safe = `${v.userInfo.firstName}-${v.userInfo.lastName}`.replace(/\s+/g, '');
  saveAs(blob, `resume-${safe}.docx`);
}
