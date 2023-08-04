import * as QRCode from "qrcode";
let qrcode;

const qr = (segs) =>
  QRCode.toDataURL(segs, function (err, url) {
    qrcode = url;
  });

const qrcodeGenerator = (data) => {
  return new Promise((resolve, reject) => {
    qr(data);
    setTimeout(() => {
      resolve(qrcode);
    }, 100);
  });
};

export default qrcodeGenerator;
