
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
    const [logs, setLogs] = useState([]);
    const navigate = useNavigate();

    // Logları veritabanından çekme fonksiyonu
    const fetchLogs = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://todoapp-server-ossaggelen.onrender.com/api/admin/logs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data);
        } catch (err) {
            console.error("Loglar çekilemedi:", err);
        }
    }, []);

    // Sayfa açılınca çalışacak kod (Güvenlik Kontrolü + Veri Çekme)
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        // 1. Güvenlik: Admin değilse ana sayfaya postala
        if (!user || user.role !== 'admin') {
            alert("Hop! Burası yasak bölge hemşehrim. 🚫");
            navigate('/');
            return;
        }

        // 2. Verileri getir
        fetchLogs();
    }, [navigate, fetchLogs]);

    // Logları Temizleme Fonksiyonu
    const clearLogs = async () => {
        if (!window.confirm("EMİN MİSİN? Tüm kayıtlar silinecek (ve bu işlem de loglanacak)! ⚠️")) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete('https://todoapp-server-ossaggelen.onrender.com/api/admin/logs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert("Temizlik yapıldı! ✨");
            fetchLogs(); // Listeyi yenile ki "Sistem Temizlendi" logunu görelim
        } catch (err) {
            alert("Silme başarısız: " + (err.response?.data?.message || "Hata"));
        }
    };

    // İşlem türüne göre renk belirleme (Görsellik)
    const getActionColor = (action) => {
        switch (action) {
            case 'CREATE': return 'green';
            case 'DELETE': return 'red';
            case 'UPDATE': return 'blue';
            case 'SYSTEM_CLEAN': return 'purple'; // Temizlik logu mor olsun
            default: return 'black';
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            
            {/* --- BAŞLIK ALANI --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #333', paddingBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldAlert size={32} color="#6f42c1" />
                    <div>
                        <h2 style={{ margin: 0 }}>Sistem Kayıtları</h2>
                        <span style={{ fontSize: '0.9em', color: '#666' }}>Admin Paneli & Audit Log</span>
                    </div>
                </div>

                {/* Temizle Butonu (Sadece log varsa görünür) */}
                {logs.length > 0 && (
                    <button 
                        onClick={clearLogs}
                        style={{ 
                            backgroundColor: '#dc3545', 
                            color: 'white', 
                            border: 'none', 
                            padding: '10px 15px', 
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}
                    >
                        <Trash2 size={18} />
                        Logları Temizle
                    </button>
                )}
            </div>
            
            {/* --- TABLO ALANI --- */}
            <div style={{ overflowX: 'auto', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', color: '#333', textAlign: 'left' }}>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Kullanıcı</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>İşlem</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Detaylar</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Tarih / Saat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                                    Henüz hiç kayıt yok. Sistem tertemiz! 🍃
                                </td>
                            </tr>
                        ) : (
                            logs.map(log => (
                                <tr key={log._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px 15px', fontWeight: 'bold', color:"gray" }}>
                                        {log.userId?.username || "Sistem / Bilinmeyen"}
                                    </td>
                                    <td style={{ padding: '12px 15px', fontWeight: 'bold', color: getActionColor(log.action) }}>
                                        {log.action}
                                    </td>
                                    <td style={{ padding: '12px 15px', color: '#555' }}>
                                        {log.details}
                                    </td>
                                    <td style={{ padding: '12px 15px', color: '#666', fontSize: '0.85em', minWidth: '150px' }}>
                                        {log.createdAt 
                                            ? new Date(log.createdAt).toLocaleString('tr-TR', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit', second: '2-digit'
                                              })
                                            : '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* --- GERİ DÖN BUTONU --- */}
            <button 
                onClick={() => navigate('/')}
                style={{ 
                    marginTop: '25px', 
                    padding: '10px 20px', 
                    cursor: 'pointer',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <ArrowLeft size={18} />
                Ana Sayfaya Dön
            </button>
        </div>
    );
};

export default AdminDashboard;