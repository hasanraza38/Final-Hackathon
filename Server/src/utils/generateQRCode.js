import QRCode from 'qrcode'

async function generateQRCode(data) {
  return await QRCode.toDataURL(data);
}

export default generateQRCode;