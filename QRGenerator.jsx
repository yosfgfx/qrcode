import React, { useState } from 'react';
import QRCodeCard from './QRCodeCard';
import { downloadAll } from '../utils/qrHelpers';

const QRGenerator = () => {
  const [urls, setUrls] = useState('');
  const [qrCodes, setQrCodes] = useState([]);

  const generateQR = () => {
    const urlList = urls.split('\n').map(url => url.trim()).filter(url => url !== '');
    const newQrCodes = urlList.map((url, index) => {
      const qr = qrcode(0, 'L');
      qr.addData(url);
      qr.make();
      return {
        name: `QRCode_${index + 1}`,
        svg: qr.createSvgTag({ scalable: true, size: 100 }),
        url: url
      };
    });
    setQrCodes(newQrCodes);
  };

  return (
    <div className="container">
      <h1 className="display-4">محول الروابط إلى رموز QR</h1>
      <p>برمجة يوسف حُميد</p>
      <div className="form-group">
        <label htmlFor="url-input">ادخل الروابط هنا:</label>
        <textarea
          id="url-input"
          className="form-control"
          rows="4"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          dir="ltr"
        ></textarea>
      </div>
      <button className="btn btn-primary" onClick={generateQR}>إنشاء رموز QR</button>
      <button className="btn btn-secondary" onClick={() => downloadAll(qrCodes)} disabled={qrCodes.length === 0}>تنزيل الكل</button>
      <div id="qr-codes">
        {qrCodes.map((qrCode, index) => (
          <QRCodeCard key={index} qrCode={qrCode} index={index} />
        ))}
      </div>
    </div>
  );
};

export default QRGenerator;