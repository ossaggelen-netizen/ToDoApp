const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Rotayı buraya dahil ediyoruz
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes'); // Üst kısma ekle
const adminRoutes = require('./routes/adminRoutes');


const app = express();

// Middleware (Sıralama çok önemli!)
app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRoutes);

// 1. ANA DİZİN (Burası çalışıyor dedin)
app.get('/', (req, res) => {
    res.send("Backend güncellendi ve çalışıyor! 🚀");
});

// 2. DEBUG TESTİ (Doğrudan index.js içinde)
app.get('/debug-test', (req, res) => {
    res.send("Debug testi başarıyla çalıştı! ✅");
});

// 3. TODO ROTALARI (/api/todos ile başlar)
app.use('/api/todos', todoRoutes);
// ...
app.use('/api/auth', authRoutes); // Middleware kısmına ekle

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB bağlantısı başarılı! ✅"))
    .catch((err) => console.log("Bağlantı hatası: ", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda yayında...`);
});