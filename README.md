## ToDo App

ToDoApp, kullanıcıların günlük görevlerini planlamasını, takip etmesini ve yönetmesini sağlayan Full Stack bir To-Do uygulamasıdır. İTÜ Racing Yazılım Ödevi kapsamında geliştirilmiştir.

Kullanıcı dostu arayüzü, canlı düzenleme (inline editing) özellikleri ve gelişmiş Admin loglama sistemi ile güvenli bir deneyim sunar.


## Özellikler

**Kullanıcı Sistemi:** JWT tabanlı güvenli Kayıt Ol (Register) ve Giriş Yap (Login) işlemleri.
**CRUD İşlemleri:** Görev ekleme, silme, güncelleme ve tamamlandı olarak işaretleme.
**Inline Editing:** Görevleri listeden ayrılmadan, satır içinde anlık düzenleyebilme.
**Admin Paneli:** Sadece yöneticilerin erişebildiği, tüm sistem hareketlerinin (Log) tutulduğu özel panel.
**Audit Logs:** Kimin, ne zaman, hangi işlemi yaptığına dair detaylı sistem kayıtları (Create, Update, Delete, System Clean).
**Sistem Temizliği:** Adminlerin veritabanı şişmesini önlemek için logları temizleyebilmesi ve bu işlemin de kayıt altına alınması (Meta-Log).


## Kullanılan Teknolojiler

**Frontend:**
* React.js (Vite)
* React Router DOM (Sayfalama)
* Axios (API İstekleri)
* Lucide React (Modern İkon Seti)

**Backend:**
* Node.js & Express.js (REST API)
* MongoDB & Mongoose (Veritabanı)
* JWT & Bcrypt (Kimlik Doğrulama ve Güvenlik)
* Dotenv & Cors (Konfigürasyon)


## Kurulum (Local)

Projeyi kendi bilgisayarınızda çalıştırmak için adımları takip edin:

1.  **Repoyu İndirin:**
    ```bash
    git clone [https://github.com/ossaggelen-netizen/ToDoApp.git](https://github.com/ossaggelen-netizen/ToDoApp.git)
    cd ToDoApp
    ```

2.  **Bağımlılıkları Yükleyin:**
    * Backend için:
        ```bash
        cd server
        npm install
        ```
    * Frontend için:
        ```bash
        cd ../client
        npm install
        ```

3.  **Çevresel Değişkenleri (.env) Ayarlayın:**
    `server` klasörü içine `.env` dosyası oluşturun ve şu bilgileri girin:
    ```env
    MONGO_URI=mongodb+srv://<kullanici>:<sifre>@cluster.mongodb.net/todoApp
    JWT_SECRET=gizli_anahtariniz
    PORT=5000
    ```

4.  **Uygulamayı Başlatın:**
    * Terminal 1 (Backend): `cd server && npm run dev`
    * Terminal 2 (Frontend): `cd client && npm run dev`

---
Developer: Osman Salih Sağgelen - 2026