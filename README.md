## Hệ thống Auth: Register/Login với OTP và Reset Password (Node.js + React)

### Backend (Node.js + Express + MongoDB)

1) Cấu hình

Tạo file `backend/.env` từ mẫu:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/auth_app
JWT_SECRET=change_this_secret
APP_NAME=Auth App
FRONTEND_URL=http://localhost:3000
# Email (để trống để log ra console khi dev)
EMAIL_USER=
EMAIL_PASS=
SMTP_HOST= # ví dụ: sandbox.smtp.mailtrap.io
SMTP_PORT=587
```

2) Cài đặt & chạy

```
cd backend
npm install
npm start
```

API chính (prefix `/api/auth`):
- POST `/register`
- POST `/verify-otp`
- POST `/resend-otp`
- POST `/login`
- POST `/forgot-password`
- GET `/reset/:token`
- POST `/reset-password`

### Frontend (React + Vite + Bootstrap)

1) Cấu hình

Tạo file `frontend/.env` từ mẫu:

```
VITE_API_BASE_URL=http://localhost:5000
```

2) Cài đặt & chạy

```
cd frontend
npm install
npm run dev
```

Routing:
- `/register`, `/verify-otp`, `/login`, `/forgot-password`, `/reset/:token`

Ghi chú:
- Ở môi trường development, email sẽ được `console.log` nếu không cấu hình SMTP.
- Để test bằng Mailtrap, tạo Inbox, dùng `SMTP_HOST`, `SMTP_PORT`, `EMAIL_USER`, `EMAIL_PASS` từ Mailtrap.