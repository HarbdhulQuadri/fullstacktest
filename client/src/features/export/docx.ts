import type { User } from '../users/types';
import { userToFormValues } from '../users/types';

export async function exportUserDocx(user: User): Promise<void> {
  const [{ Document, Packer, Paragraph, TextRun, HeadingLevel }, { saveAs }] =
    await Promise.all([import('docx'), import('file-saver')]);
  const v = userToFormValues(user);

  const heading = (text: string) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text, color: '312E81' })],
    });

  const kv = (label: string, value: string) =>
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
    heading('Personal'),
    kv('Date of Birth', v.userInfo.dob),
    kv('Gender', v.userInfo.gender),
    heading('Contact'),
    kv('Email', v.userContact.email),
    kv('Phone', v.userContact.phoneNumber),
    kv('Fax', v.userContact.fax ?? ''),
    kv('LinkedIn', v.userContact.linkedInUrl ?? ''),
    heading('Address'),
    kv('Street', v.userAddress.address),
    kv('City', v.userAddress.city),
    kv('State', v.userAddress.state),
    kv('Country', v.userAddress.country),
    kv('Zip Code', v.userAddress.zipCode),
    heading('Education'),
    ...v.userAcademics.map(
      (a) =>
        new Paragraph({
          children: [
            new TextRun({ text: a.schoolName, bold: true }),
            ...(a.degree || a.fieldOfStudy
              ? [
                  new TextRun({
                    text: ` — ${[a.degree, a.fieldOfStudy].filter(Boolean).join(' · ')}`,
                  }),
                ]
              : []),
          ],
        }),
    ),
  ];

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const safe = `${v.userInfo.firstName}-${v.userInfo.lastName}`.replace(/\s+/g, '');
  saveAs(blob, `resume-${safe}.docx`);
}
