import type { User } from '../users/types';
import { userToFormValues } from '../users/types';
import ResumeTemplate from '../../components/wizard/ResumeTemplate';

/**
 * Renders the on-screen `ResumeTemplate` preview to a canvas. The PDF therefore
 * matches the preview exactly (same layout, styles and content). If a profile
 * photo is cross-origin and taints the canvas, we retry with images hidden so
 * the export still succeeds.
 */
async function renderToCanvas(
  source: HTMLElement,
  stripImages: boolean,
): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import('html2canvas');
  if (stripImages) {
    source.querySelectorAll('img').forEach((img) => {
      img.style.display = 'none';
    });
  }
  return html2canvas(source, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  });
}

async function awaitImages(source: HTMLElement): Promise<void> {
  const imgs = Array.from(source.querySelectorAll('img'));
  await Promise.all(
    imgs.map((img) =>
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.addEventListener('load', () => resolve(), { once: true });
            img.addEventListener('error', () => resolve(), { once: true });
          }),
    ),
  );
}

export async function exportUserPdf(user: User): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const { createElement } = await import('react');
  const { createRoot } = await import('react-dom/client');
  const { flushSync } = await import('react-dom');

  const values = userToFormValues(user);

  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.left = '-10000px';
  host.style.top = '0';
  host.style.width = '794px';
  host.style.background = '#ffffff';
  document.body.appendChild(host);

  // React 18 render() is asynchronous; flushSync guarantees the node exists
  // before we read host.firstElementChild below.
  const root = createRoot(host);
  flushSync(() => {
    root.render(createElement(ResumeTemplate, { values }));
  });

  const source = host.firstElementChild as HTMLElement;
  await awaitImages(source);
  // Give fonts/layout a moment to settle before capturing.
  await new Promise((resolve) => setTimeout(resolve, 150));

  let canvas: HTMLCanvasElement;
  try {
    canvas = await renderToCanvas(source, false);
  } catch {
    canvas = await renderToCanvas(source, true);
  } finally {
    root.unmount();
    document.body.removeChild(host);
  }

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const imgW = pageW;
  const imgH = (canvas.height * imgW) / canvas.width;
  const imgData = canvas.toDataURL('image/png');

  let heightLeft = imgH;
  let position = 0;
  doc.addImage(imgData, 'PNG', 0, position, imgW, imgH);
  heightLeft -= pageH;
  while (heightLeft > 0) {
    position -= pageH;
    doc.addPage();
    doc.addImage(imgData, 'PNG', 0, position, imgW, imgH);
    heightLeft -= pageH;
  }

  const safe = `${values.userInfo.firstName}-${values.userInfo.lastName}`.replace(
    /\s+/g,
    '',
  );
  doc.save(`resume-${safe}.pdf`);
}
