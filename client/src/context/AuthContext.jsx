import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Uygulama her açıldığında daha önce giriş yapılmış mı kontrol et (Persistence)
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = async (username, password) => {
        try {
            const res = await axios.post('https://todoapp-server-ossaggelen.onrender.com/api/auth/login', { username, password });
            setUser(res.data.user);
            localStorage.setItem('token', res.data.token); // Biletini cebine koy (Save token)
            localStorage.setItem('user', JSON.stringify(res.data.user)); // Kimliğini kaydet
            return true;
        } catch (err) {
            alert("Giriş başarısız: " + err.response.data.message);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};