// server/middleware/admin.js
module.exports = function (req, res, next) {
    // auth middleware'i req.user'ı zaten doldurmuştu
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Erişim reddedildi! Admin yetkisi gerek." });
    }
    next();
};