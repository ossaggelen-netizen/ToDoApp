import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { CheckSquare } from 'lucide-react'; // İkonu unutma

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // İŞTE EKSİK OLAN FONKSİYON BU:
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/'); // Başarılıysa ana sayfaya git
        } catch (err) {
            alert("Giriş başarısız! Kullanıcı adı veya şifre yanlış.");
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh', 
            backgroundColor: '#f4f4f4',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* LOGO VE İSİM KISMI */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <CheckSquare size={48} color="#6f42c1" strokeWidth={2.5} />
                <h1 style={{ color: '#333', fontSize: '2.5rem', margin: 0 }}>ToDo App</h1>
            </div>

            {/* FORM KISMI */}
            <div style={{ 
                backgroundColor: 'white', 
                padding: '40px', 
                borderRadius: '10px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                width: '350px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>Login</h2>
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px', outline: 'none' }}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px', outline: 'none' }}
                    />
                    <button type="submit" style={{ 
                        backgroundColor: '#6f42c1', 
                        color: 'white', 
                        padding: '12px', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold',
                        fontSize: '16px',
                        transition: '0.3s'
                    }}>
                        Log in
                    </button>
                </form>
                
                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9em', color: '#666' }}>
                    Don't you have an account? <Link to="/register" style={{ color: '#6f42c1', fontWeight: 'bold', textDecoration: 'none' }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;   