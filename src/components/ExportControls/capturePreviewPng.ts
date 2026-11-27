import { toPng } from 'html-to-image';

export async function capturePreviewPng(preview: HTMLElement, pixelRatio: number) {
  const previewRect = preview.getBoundingClientRect();
  const exportClone = preview.cloneNode(true) as HTMLDivElement;
  const exportHost = document.createElement('div');
  exportHost.style.position = 'fixed';
  exportHost.style.left = '-10000px';
  exportHost.style.top = '0';
  exportClone.style.width = `${previewRect.width}px`;
  exportClone.style.height = `${previewRect.height}px`;
  exportClone.style.maxWidth = 'none';
  exportClone.style.margin = '0';
  exportClone.style.position = 'relative';

  const sourceViewport = preview.querySelector<HTMLElement>(
    '[data-preview-scroll-viewport]',
  );
  const cloneViewport = exportClone.querySelector<HTMLElement>(
    '[data-preview-scroll-viewport]',
  );
  const cloneContent = exportClone.querySelector<HTMLElement>(
    '[data-preview-scroll-content]',
  );

  if (sourceViewport && cloneViewport && cloneContent) {
    cloneViewport.style.overflow = 'hidden';
    cloneContent.style.transform = `translateY(-${sourceViewport.scrollTop}px)`;
  }

  exportHost.appendChild(exportClone);
  document.body.appendChild(exportHost);

  try {
    return await toPng(exportClone, {
      cacheBust: true,
      pixelRatio,
      backgroundColor: '#242832',
      style: { margin: '0', boxShadow: 'none' },
    });
  } finally {
    exportHost.remove();
  }
}
