import QRCode from "qrcode.react";

export default function TableQR({ tableId }) {
  const url = `https://fnb-qr-order-1.onrender.com/?tableId=${tableId}`;
  return (
    <div>
      <h3>Bàn {tableId}</h3>
      <QRCode value={url} size={200} />
    </div>
  )
}
