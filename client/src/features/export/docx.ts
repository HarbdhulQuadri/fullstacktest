import type { User } from '../users/types';
import { userToFormValues } from '../users/types';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  BorderStyle,
  WidthType,
  Table,
  TableRow,
  TableCell,
  TableBorders,
} from 'docx';
import { saveAs } from 'file-saver';

const INDIGO = '4F46E5';
const INDIGO_BAR = '6366F1';
const LABEL = '475569';
const VALUE = '1E293B';
const MUTED = '64748B';
const FAINT = '94A3B8';

type RunOpts = { bold?: boolean; italics?: boolean; size?: number; color?: string };

/**
 * DOCX mirrors the on-screen `ResumeTemplate` preview: dark name, indigo
 * occupation, indigo uppercase section titles with an accent bar, and the same
 * Contact / Address / Personal / Education content order.
 */
export async function exportUserDocx(user: User): Promise<void> {
  const v = userToFormValues(user);

  const run = (text: string, opts: RunOpts = {}) =>
    new TextRun({
      text,
      color: opts.color ?? VALUE,
      bold: opts.bold,
      italics: opts.italics,
      size: opts.size,
    });

  const title = (text: string) =>
    new Paragraph({
      spacing: { before: 240, after: 120 },
      border: { left: { style: BorderStyle.SINGLE, size: 18, color: INDIGO_BAR, space: 80 } },
      children: [run(text.toUpperCase(), { bold: true, color: INDIGO, size: 16 })],
    });

  const kv = (label: string, value?: string | null) =>
    new Paragraph({
      spacing: { after: 80 },
      children: [
        run(`${label}: `, { bold: true, color: LABEL, size: 20 }),
        run(value || '—', { color: VALUE, size: 20 }),
      ],
    });

  const line = (text?: string | null) =>
    new Paragraph({
      spacing: { after: 60 },
      children: [run(text || '', { color: MUTED, size: 20 })],
    });

  const education = v.userAcademics.length === 0
    ? [new Paragraph({ children: [run('No education records.', { color: FAINT, size: 20 })] })]
    : v.userAcademics
        .map((a) => {
          const paras = [
            new Paragraph({
              spacing: { before: 120, after: 40 },
              children: [run(a.schoolName, { bold: true, color: VALUE, size: 22 })],
            }),
          ];
          const detail = [a.degree, a.fieldOfStudy].filter(Boolean).join(' · ');
          if (detail) paras.push(new Paragraph({ spacing: { after: 40 }, children: [run(detail, { color: MUTED, size: 20 })] }));
          const dates = [a.startDate, a.endDate].filter(Boolean).join(' — ');
          if (dates) paras.push(new Paragraph({ spacing: { after: 40 }, children: [run(dates, { color: FAINT, size: 18 })] }));
          if (a.description) paras.push(new Paragraph({ spacing: { after: 80 }, children: [run(a.description, { color: LABEL, size: 20 })] }));
          return paras;
        })
        .flat();

  // Create a 2-column table for the middle sections (Contact vs Address/Personal)
  const layoutTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TableBorders.NONE,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { right: 400 },
            children: [
              title('Contact'),
              kv('Email', v.userContact.email),
              kv('Phone', v.userContact.phoneNumber),
              ...(v.userContact.fax ? [kv('Fax', v.userContact.fax)] : []),
              ...(v.userContact.linkedInUrl ? [kv('LinkedIn', v.userContact.linkedInUrl)] : []),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { left: 400 },
            children: [
              title('Address'),
              line(v.userAddress.address),
              line(`${v.userAddress.city}, ${v.userAddress.state} ${v.userAddress.zipCode}`),
              line(v.userAddress.country),
              title('Personal'),
              kv('DOB', v.userInfo.dob),
              kv('Gender', v.userInfo.gender),
            ],
          }),
        ],
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 } }
        },
        children: [
          new Paragraph({
            spacing: { after: 80 },
            children: [run(`${v.userInfo.firstName} ${v.userInfo.lastName}`, { bold: true, size: 48, color: '0F172A' })],
          }),
          new Paragraph({
            spacing: { after: 400 },
            children: [run(v.userInfo.occupation || '—', { italics: true, size: 24, color: INDIGO })],
          }),
          
          layoutTable,

          new Paragraph({ spacing: { before: 400 } }),
          title('Education'),
          ...education,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safe = `${v.userInfo.firstName}-${v.userInfo.lastName}`.replace(/\s+/g, '');
  saveAs(blob, `resume-${safe}.docx`);
}
