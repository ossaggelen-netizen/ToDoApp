import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Edit2, Check, X, CheckSquare, LogOut, Shield } from 'lucide-react';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Düzenleme (Inline Edit) State'leri
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const fetchTodos = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://todoapp-server-ossaggelen.onrender.com/api/todos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(res.data)) {
                setTodos(res.data);
            } else {
                setTodos([]);
            }
        } catch (err) {
            console.error("Hata:", err);
            setTodos([]);
        }
    }, []);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    // GÖREV EKLEME
    const addTodo = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://todoapp-server-ossaggelen.onrender.com/api/todos', 
                { title }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTitle('');
            fetchTodos();
        } catch (err) {
            console.error(err);
        }
    };

    // GÖREV SİLME
    const deleteTodo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://todoapp-server-ossaggelen.onrender.com/api/todos/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTodos();
        } catch (err) {
            console.error(err);
        }
    };

    // DURUM DEĞİŞTİRME (Tamamlandı / Tamamlanmadı)
    const toggleTodo = async (id, completed) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`https://todoapp-server-ossaggelen.onrender.com/api/todos/${id}`, 
                { completed: !completed }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTodos();
        } catch (err) {
            console.error(err);
        }
    };

    // DÜZENLEME BAŞLAT
    const startEditing = (todo) => {
        setEditingId(todo._id);
        setEditText(todo.title);
    };

    // DÜZENLEME İPTAL
    const cancelEditing = () => {
        setEditingId(null);
        setEditText("");
    };

    // DÜZENLEME KAYDET
    const saveEdit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`https://todoapp-server-ossaggelen.onrender.com/api/todos/${id}`, 
                { title: editText }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditingId(null);
            fetchTodos();
        } catch (err) {
            alert("Güncelleme başarısız!");
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa', fontFamily: 'Arial, sans-serif' }}>
            
            {/* --- NAVBAR (ÜST MENÜ) --- */}
            <nav style={{ 
                backgroundColor: 'white', 
                padding: '15px 10%', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckSquare size={28} color="#6f42c1" />
                    <h2 style={{ margin: 0, color: '#2d3748', fontSize: '1.5rem' }}>ToDo App</h2>
                </div>

                {/* Sağ Taraf */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ color: '#4a5568', fontWeight: '600' }}>
                        👤 {user?.username}
                    </span>
                    
                    {/* Admin Butonu */}
                    {user?.role === 'admin' && (
                        <button 
                            onClick={() => navigate('/admin')}
                            style={{ 
                                padding: '8px 15px', 
                                backgroundColor: '#6f42c1', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '6px', 
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                fontSize: '0.9em',
                                transition: '0.2s'
                            }}
                        >
                            <Shield size={16} /> Panel
                        </button>
                    )}

                    <button 
                        onClick={logout} 
                        style={{ 
                            color: '#e53e3e', 
                            cursor: 'pointer', 
                            border: '1px solid #e53e3e', 
                            background: 'white', 
                            padding: '6px 12px',
                            borderRadius: '6px',
                            display: 'flex', alignItems: 'center', gap: '5px',
                            fontWeight: 'bold',
                            fontSize: '0.9em'
                        }}
                    >
                        <LogOut size={16} /> Log Out
                    </button>
                </div>
            </nav>

            {/* --- İÇERİK KISMI --- */}
            <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>
                
                {/* GÖREV EKLEME FORMU */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '25px' }}>
                    <form onSubmit={addTodo} style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            value={title} 
                            placeholder="Add a new task..." 
                            onChange={(e) => setTitle(e.target.value)} 
                            style={{ 
                                flex: 1, 
                                padding: '12px', 
                                borderRadius: '8px', 
                                border: '1px solid #e2e8f0',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            required 
                        />
                        <button type="submit" style={{ 
                            padding: '0 20px', 
                            backgroundColor: '#48bb78', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Plus size={24} />
                        </button>
                    </form>
                </div>

                {/* GÖREV LİSTESİ */}
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {todos.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#a0aec0', marginTop: '20px' }}>There are no tasks yet.</p>
                    ) : (
                        todos.map(todo => (
                            <li key={todo._id} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                padding: '15px', 
                                borderBottom: '1px solid #edf2f7',
                                backgroundColor: todo.completed ? '#f7fafc' : 'white',
                                color: '#2d3748',
                                alignItems: 'center',
                                borderRadius: '8px',
                                marginBottom: '10px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                transition: '0.2s'
                            }}>
                                
                                {editingId === todo._id ? (
                                    // --- DÜZENLEME MODU ---
                                    <div style={{ display: 'flex', flex: 1, gap: '10px', alignItems: 'center' }}>
                                        <input 
                                            type="text" 
                                            value={editText} 
                                            onChange={(e) => setEditText(e.target.value)}
                                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                                            autoFocus
                                        />
                                        <button onClick={() => saveEdit(todo._id)} style={{ color: '#38a169', background: 'none', border: 'none', cursor: 'pointer' }} title="Save">
                                            <Check size={20} />
                                        </button>
                                        <button onClick={cancelEditing} style={{ color: '#718096', background: 'none', border: 'none', cursor: 'pointer' }} title="Cancel">
                                            <X size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    // --- NORMAL MOD ---
                                    <>
                                        <div 
                                            onClick={() => toggleTodo(todo._id, todo.completed)} 
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '12px',
                                                flex: 1,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div style={{
                                                width: '20px', height: '20px',
                                                borderRadius: '50%',
                                                border: todo.completed ? 'none' : '2px solid #cbd5e0',
                                                backgroundColor: todo.completed ? '#48bb78' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {todo.completed && <Check size={14} color="white" />}
                                            </div>
                                            
                                            <span style={{ 
                                                textDecoration: todo.completed ? 'line-through' : 'none',
                                                color: todo.completed ? '#a0aec0' : '#2d3748',
                                                fontSize: '1.1rem'
                                            }}>
                                                {todo.title}
                                            </span>
                                        </div>
                                        
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => startEditing(todo)} style={{ color: '#3182ce', border: 'none', background: 'none', cursor: 'pointer', padding: '5px' }} title="Edit">
                                                <Edit2 size={18} />
                                            </button>
                                            
                                            <button onClick={() => deleteTodo(todo._id)} style={{ color: '#e53e3e', border: 'none', background: 'none', cursor: 'pointer', padding: '5px' }} title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Home;