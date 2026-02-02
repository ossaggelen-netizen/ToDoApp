const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Hangi kullanıcıya ait olduğu
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Todo', TodoSchema);