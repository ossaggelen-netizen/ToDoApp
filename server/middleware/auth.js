const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // İsteğin başlığındaki (header) token'ı al
    const token = req.header('Authorization');

    // Token yoksa girişi engelle (Deny access)
    if (!token) return res.status(401).json({ message: "Yetki yok, giriş yapmalısın! (No token, authorization denied)" });

    try {
        // Token'ı doğrula (Verify token)
        // Not: Token genelde "Bearer <token>" şeklinde gelir, o yüzden Bearer kısmını siliyoruz
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || 'gizli_anahtar');
        
        // Kullanıcı bilgisini isteğe ekle ki rotalarda kullanabilelim
        req.user = decoded;
        
        next(); // Her şey okeyse bir sonraki aşamaya geç (Move to next step)
    } catch (err) {
        res.status(401).json({ message: "Token geçersiz! (Token is not valid)" });
    }
};

module.exports = auth;