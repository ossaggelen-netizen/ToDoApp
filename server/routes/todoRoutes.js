console.log("todoRoutes.js dosyası başarıyla yüklendi! 🚀");

const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const Log = require('../models/Log');
const auth = require('../middleware/auth');


// 2. KULLANICININ GÖREVLERİNİ LİSTELE (Read - GET)
// Dikkat: Buraya 'auth' ekledik ki kimin istediğini bilelim
router.get('/', auth, async (req, res) => {
    try {
        // Todo.find() parantezinin içine filtre ekliyoruz:
        // "Sadece userId'si benim ID'mle eşleşenleri getir"
        const todos = await Todo.find({ userId: req.user.id }); 
        
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: "Veriler alınamadı" });
    }
});

// 2. GÖREVİ GÜNCELLE (Update - PATCH)
// 3. GÖREVİ GÜNCELLE (Update - PATCH)
router.patch('/:id', async (req, res) => {
    try {
        const { title, description, completed } = req.body;
        
        // Önce eski halini bulalım (Log için lazım olacak)
        const oldTodo = await Todo.findById(req.params.id);
        if (!oldTodo) return res.status(404).json({ message: "Görev bulunamadı" });

        // Güncelleme yapalım
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id, 
            { title, description, completed }, // Gelen verileri güncelle
            { new: true } // Güncel halini döndür
        );

        // LOGLAMA MANTIĞI: Ne değiştiyse onu yazalım
        let logDetails = "";
        
        if (title && title !== oldTodo.title) {
            logDetails = `Görev adı değiştirildi: "${oldTodo.title}" -> "${title}"`;
        } else if (completed !== undefined && completed !== oldTodo.completed) {
            logDetails = `Görev durumu değişti: ${completed ? 'Tamamlandı' : 'Geri alındı'}`;
        } else {
            logDetails = "Görev güncellendi";
        }

        const newLog = new Log({
            userId: updatedTodo.userId,
            action: 'UPDATE',
            todoId: updatedTodo._id,
            details: logDetails
        });
        await newLog.save();

        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. GÖREVİ SİL (Delete - DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        
        // İşlemi Logla
        const newLog = new Log({
            userId: todo.userId,
            action: 'DELETE',
            details: `Görev kalıcı olarak silindi: ${todo.title}`
        });
        await newLog.save();

        res.json({ message: "Görev ve log silindi (Task and log deleted)" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Bu adres aslında: POST https://todoapp-server-ossaggelen.onrender.com/api/todos
router.post('/', auth, async (req, res) => {
    try {
        // 1. Önce modeli oluşturuyoruz
        const todo = new Todo({
            title: req.body.title,
            description: req.body.description || "Açıklama yok",
            userId: req.user.id
        });

        // 2. KAYDETME: Değişkeni burada tanımlıyoruz (Variable Declaration)
        const savedTodo = await todo.save(); 
        
        // 3. LOGLAMA: savedTodo değişkenini kullanıyoruz
        const newLog = new Log({
            userId: req.user.id,
            action: 'CREATE',
            details: `Görev eklendi: ${savedTodo.title}`
        });
        await newLog.save();

        // 4. CEVAP: savedTodo'yu geri gönderiyoruz
        res.status(201).json(savedTodo);

    } catch (err) {
        // Eğer hata buraya düşerse, terminale hatanın tam halini yazdıralım (Debugging)
        console.error("Post hatası detayları:", err);
        res.status(400).json({ message: err.message });
    }
});

// Mutlaka en altta bu olmalı!
module.exports = router;