import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Backend'e kayıt isteği atıyoruz (POST request)
            await axios.post('http://localhost:5000/api/auth/register', {
                username,
                password,
                role: 'user' // Varsayılan olarak normal kullanıcı yapıyoruz
            });

            alert("Kayıt başarılı! Şimdi giriş yapabilirsin. ✅");
            navigate('/login'); // Başarılıysa Login sayfasına yolla
        } catch (err) {
            alert("Kayıt hatası: " + (err.response?.data?.message || "Bilinmeyen hata"));
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <h2>Kayıt Ol (Register) 📝</h2>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
                <input 
                    type="text" 
                    placeholder="Kullanıcı Adı Seç" 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    style={{ padding: '10px' }}
                />
                <input 
                    type="password" 
                    placeholder="Şifre Belirle" 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ padding: '10px' }}
                />
                <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', padding: '10px', cursor: 'pointer' }}>
                    Kayıt Ol
                </button>
            </form>
            
            <p style={{ marginTop: '10px' }}>
                Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
            </p>
        </div>
    );
};

export default Register;