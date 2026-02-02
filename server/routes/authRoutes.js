const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. KAYIT OL (Register)
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Şifreyi şifrele (Hash the password)
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            role: role || 'user'
        });

        await newUser.save();
        res.status(201).json({ message: "Kullanıcı oluşturuldu! (User created)" });
    } catch (err) {
        res.status(400).json({ message: "Kayıt hatası: " + err.message });
    }
});

// 2. GİRİŞ YAP (Login)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

        // Şifreyi kontrol et (Compare passwords)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Hatalı şifre" });

        // Giriş bileti oluştur (Generate JWT Token)
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;