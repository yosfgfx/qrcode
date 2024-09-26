import React, { useState } from 'react';
import { saveAs } from 'file-saver';

const QRCodeCard = ({ qrCode, index }) => {
  const [copied, setCopied] = useState(false);

  const downloadSVG = () => {
    const blob = new Blob([qrCode.svg], { type: 'image/svg+xml' });
    saveAs(blob, `${qrCode.name}.svg`);
  };

  const downloadPNG = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${qrCode.name}.png`);
        }
      });
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(qrCode.svg);
  };

  const copyToClipboard = (type) => {
    if (type === 'SVG') {
      navigator.clipboard.writeText(qrCode.svg).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else if (type === 'PNG') {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          }
        });
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(qrCode.svg);
    }
  };

  return (
    <div>
      <div style={{ fontWeight: 'bold' }}>{qrCode.name}</div>
      <div dangerouslySetInnerHTML={{ __html: qrCode.svg }}></div>
      <div>
        <button onClick={downloadSVG}>حفظ كملف SVG</button>
        <button onClick={() => copyToClipboard('SVG')}>نسخ إلى الحافظة SVG</button>
      </div>
      <div>
        <button onClick={downloadPNG}>حفظ كملف PNG</button>
        <button onClick={() => copyToClipboard('PNG')}>نسخ إلى الحافظة PNG</button>
      </div>
      {copied && <div className="alert alert-success mt-2">تم النسخ إلى الحافظة</div>}
    </div>
  );
};

export default QRCodeCard;