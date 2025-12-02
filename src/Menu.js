import React, { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API || "https://fnb-qr-order-backend.onrender.com";

export default function Menu() {
  const params = new URLSearchParams(window.location.search);
  const tableId = params.get("table") || "UNKNOWN";
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [noteItem, setNoteItem] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/menu`)
      .then(res => setMenu(res.data))
      .catch(err => {
        console.error("Fetch menu error:", err);
        setMenu([]);
      });
  }, []);

  const addToCart = (item) => {
    const exist = cart.find(i => i.menu_item_id === item.id);
    if (exist) {
      setCart(cart.map(i => i.menu_item_id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { menu_item_id: item.id, name: item.name, price: item.price, quantity: 1, note: "" }]);
    }
  };

  const updateNote = (id, note) => {
    setCart(cart.map(i => i.menu_item_id === id ? { ...i, note } : i));
  };

  const sendOrder = () => {
    if (cart.length === 0) return alert("Giỏ hàng trống");
    const payload = { table_id: tableId, items: cart };
    axios.post(`${API}/api/orders`, payload)
      .then(res => {
        alert("Order đã gửi! ID: " + res.data.order_id);
        setCart([]);
      })
      .catch(err => {
        console.error(err);
        alert("Lỗi gửi order");
      });
  };

  const total = cart.reduce((s, i) => s + (i.price * i.quantity || 0), 0);

  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>
      <div style={{ flex: 3 }}>
        <h1>Menu — Bàn {tableId}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {menu.map(item => (
            <div key={item.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
              <img src={item.image_url} alt={item.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6 }} />
              <h3>{item.name}</h3>
              <p style={{ color: '#666' }}>{item.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <b>{(item.price || 0).toLocaleString()} VND</b>
                <button onClick={() => addToCart(item)}>Thêm</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: 320, border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
        <h3>Giỏ hàng</h3>
        {cart.length === 0 && <p>Chưa có món nào</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cart.map(it => (
            <div key={it.menu_item_id} style={{ border: '1px dashed #eee', padding: 8, borderRadius: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>{it.name}</div>
                <div>x{it.quantity}</div>
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>{(it.price || 0).toLocaleString()} VND</div>
              <button onClick={() => setNoteItem(it)}>Ghi chú</button>
              {it.note && <div style={{ marginTop: 6, background: '#fff3cd', padding: 6, borderRadius: 4 }}>Note: {it.note}</div>}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, fontWeight: 'bold' }}>
          Tổng: {total.toLocaleString()} VND
        </div>
        <button style={{ marginTop: 10 }} onClick={sendOrder}>Gửi Order</button>
      </div>

      {noteItem && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
          <div style={{ background: 'white', padding: 16, borderRadius: 8, width: 320 }}>
            <h4>Ghi chú - {noteItem.name}</h4>
            <textarea rows={4} style={{ width: '100%' }} value={noteItem.note} onChange={(e) => updateNote(noteItem.menu_item_id, e.target.value)} />
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <button onClick={() => setNoteItem(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
