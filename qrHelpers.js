import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const downloadAll = async (qrCodes) => {
  const zip = new JSZip();
  const svgFolder = zip.folder('SVG');
  const pngFolder = zip.folder('PNG');

  for (let index = 0; index < qrCodes.length; index++) {
    const qrCode = qrCodes[index];
    
    // SVG
    svgFolder.file(`${qrCode.name}.svg`, qrCode.svg);

    // PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          pngFolder.file(`${qrCode.name}.png`, blob);
        }
        if (index === qrCodes.length - 1) {
          zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, 'QRCodes.zip');
          });
        }
      });
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(qrCode.svg);
  }
};

// يمكن إضافة المزيد من الوظائف المساعدة هنا حسب الحاجة