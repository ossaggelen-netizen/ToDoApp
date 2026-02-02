// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin'); // Yeni yazdığımız fedai
const Log = require('../models/Log');
const User = require('../models/User'); // populate için gerekebilir

// Sadece Adminlerin erişebileceği log çekme rotası
// Önce 'auth' kontrol eder (Giriş yapmış mı?), sonra 'admin' kontrol eder (Yetkisi var mı?)
router.get('/logs', [auth, admin], async (req, res) => {
    try {
        // Logları getir ve userId alanını doldur (populate) ki kimin yaptığını ismen görelim
        const logs = await Log.find()
            .populate('userId', 'username') // Sadece username'i getir, şifreyi getirme
            .sort({ createdAt: -1 }); // En yeniden eskiye sırala

        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: "Loglar alınamadı" });
    }
});

// server/routes/adminRoutes.js içine ekle:

// TÜM LOGLARI SİL (Sadece Admin)
router.delete('/logs', [auth, admin], async (req, res) => {
    try {
        // 1. Önce veritabanındaki TÜM logları sil
        await Log.deleteMany({}); 

        // 2. HEMEN ARDINDAN "Ben sildim" diye yeni bir kayıt at (İşte Meta-Log bu)
        const cleanLog = new Log({
            userId: req.user.id,
            action: 'SYSTEM_CLEAN', // Frontend'de mor renk verdiğimiz kod
            details: 'Tüm sistem kayıtları Admin tarafından temizlendi ve sıfırlandı.'
        });
        await cleanLog.save();

        // 3. Başarılı mesajı dön
        res.json({ message: "Temizlik yapıldı ve kayıt altına alındı." });

    } catch (err) {
        res.status(500).json({ message: "İşlem başarısız: " + err.message });
    }
});

module.exports = router;