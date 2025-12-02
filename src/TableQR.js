import React, { useEffect, useState } from "react";

export default function TableQR() {
  const [tableId, setTableId] = useState(null);
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('table') || params.get('tableId') || params.get('tid');
    setTableId(id);

    if (id) {
      const t = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(t);
            window.location.href = `/menu?table=${id}`;
            return 0;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(t);
    }
  }, []);

  if (!tableId) {
    return (
      <div style={{ minHeight: '100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
        <h2>QR không hợp lệ</h2>
        <p>Không tìm thấy thông tin bàn trên đường dẫn.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
      <h1>Chào mừng — Bàn {tableId}</h1>
      <p>Bạn sẽ được chuyển sang menu trong {countdown} giây</p>
      <a href={`/menu?table=${tableId}`} style={{ marginTop: 12, padding: '10px 18px', background:'#2b9348', color:'#fff', borderRadius:8 }}>Vào Menu</a>
    </div>
  );
}
