const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    todoId: { // Hangi görev üzerinde işlem yapıldı (Opsiyonel)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo'
    },
    details: {
        type: String
    },
    createdAt: { // <--- İŞTE EKSİK OLAN PARÇA BU
        type: Date,
        default: Date.now // Kayıt atıldığı anın saatini otomatik basar
    }
});

module.exports = mongoose.model('Log', LogSchema);