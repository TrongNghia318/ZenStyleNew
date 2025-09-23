# ZENSTYLE — Laravel (API) + React (UI)

Monorepo gồm:
- **backend/** — Laravel 10+ (REST API)
- **frontend/** — React (Create React App)

---

## 1. Yêu cầu môi trường

- Node.js ≥ 18 & npm
- PHP ≥ 8.1
- Composer
- MySQL
- Git

**Kiểm tra nhanh:**
```sh
node -v && npm -v
php -v
composer -V
git --version
```

---

## 2. Clone & cấu trúc thư mục

```sh
git clone https://github.com/lengockieuanh/ZenStyle.git
cd ZenStyle
```

**Cấu trúc chính:**
```
ZenStyle/
├─ backend/      # Laravel API
└─ frontend/     # React App (Create React App)
```

---

## 3. Chạy nhanh (Quick Start)

### Backend (Laravel)
```sh
cd backend
composer install

# Tạo file .env từ mẫu
copy .env.example .env        # Windows PowerShell
# hoặc: cp .env.example .env  # Git Bash/Mac/Linux

# Tạo APP_KEY & chỉnh DB trong .env
php artisan key:generate

# (Sửa DB_* trong .env cho đúng)
php artisan migrate --seed    # nếu có seeder

php artisan serve             # http://127.0.0.1:8000
```

**Ví dụ .env tối thiểu (`backend/.env`):**
```
APP_NAME=ZenStyle
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

LOG_CHANNEL=stack

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=zenstyle
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=http://localhost:3000
```

> Dùng MySQL: đặt `DB_CONNECTION=mysql` và tạo file `database/database.mysql`.

---

### Frontend (React - Create React App)
```sh
cd ../frontend
npm install

# Tạo file .env từ mẫu (nếu có)
copy .env.example .env        # Windows PowerShell
# hoặc: cp .env.example .env  # Git Bash/Mac/Linux

npm start     # CRA => http://localhost:3000
```

**Ví dụ .env tối thiểu (`frontend/.env`):**
```
REACT_APP_API_BASE_URL=http://127.0.0.1:8000
```

**Gọi API trong code FE:**
```js
const api = process.env.REACT_APP_API_BASE_URL;
```

---

## 4. Quy ước Git (workflow đề xuất)

- Nhánh chính: `main` (ổn định).
- Làm task theo nhánh tính năng:
  ```sh
  git checkout -b feature/<ten-ngan-gon>
  # code...
  git add .
  git commit -m "feat: mo ta ngan gon"
  git push -u origin feature/<ten-ngan-gon>
  ```
- Tạo Pull Request vào `main`, 1–2 người review → merge.

**Quy ước commit:**
- `feat:` ... thêm tính năng
- `fix:` ... sửa lỗi
- `chore:` ... việc lặt vặt/tooling
- `docs:` ... tài liệu
- `refactor:` ... chỉnh code không đổi hành vi
- `test:` ... test

---

## 5. API & Router (gợi ý)

- Mọi endpoint backend đặt dưới `/api/*` (Laravel: `routes/api.php`).
- FE gọi: `GET ${API_BASE_URL}/api/...`

**Ví dụ route Laravel:**
```php
Route::get('/health', fn () => response()->json(['ok' => true]));
```

---

## 6. Ghi chú CORS

- Nếu FE và BE chạy khác port, cần bật CORS.
- Laravel đã có sẵn `config/cors.php`.
- Đặt `allowed_origins` hoặc dùng biến `FRONTEND_URL` như ví dụ trên.

---

## 7. Scripts hữu ích

**Backend**
```sh
php artisan migrate         # chạy migration
php artisan migrate:fresh   # reset DB (xoá & tạo lại)
php artisan tinker          # REPL
php artisan route:list      # xem routes
```

**Frontend**
```sh
npm start     # CRA dev server
npm run build # build production
```

---

## 8. Troubleshooting

- **FE không gọi được API (CORS):**
  - Kiểm tra `config/cors.php` và `FRONTEND_URL` trùng với origin FE (`http://localhost:3000`).
- **php artisan báo thiếu extension:**
  - Mở `php.ini` bật các extension cần (`pdo_mysql`, `mbstring`, `openssl`, `intl`…).
- **Không thấy APP_KEY hoặc 500 error:**
  ```sh
  php artisan key:generate
  php artisan config:clear
  php artisan cache:clear
  ```
- **MySQL kết nối lỗi:**
  - Kiểm tra `DB_HOST`, `DB_PORT`, user/password và database đã tạo chưa.

---

## 9. Quy ước thư mục & bảo mật

- KHÔNG commit: `backend/.env`, `frontend/.env`, `node_modules/`, `backend/vendor/`, file build.
- Đã được khai báo trong `.gitignore`.
- Tạo `backend/.env.example` và `frontend/.env.example` để mọi người dễ copy cấu hình.

---

## 10. Roadmap ngắn (gợi ý)

- Auth (JWT/Passport/Sanctum)
- CRUD Services/Bookings
- Phân quyền (Admin/Receptionist/Stylist/Client)