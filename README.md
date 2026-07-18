# 📚 EnglishMate
![React Native](https://img.shields.io/badge/React%20Native-0.7x-blue?logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK-black?logo=expo)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MySQL](https://img.shields.io/badge/Database-MySQL-blue?logo=mysql)
![License](https://img.shields.io/badge/License-Educational-orange)


> Aplikasi kursus bahasa Inggris berbasis mobile yang dikembangkan menggunakan React Native (Expo) dan Node.js sebagai proyek UAS Mobile Programming.

---

## 📖 Deskripsi

EnglishMate adalah aplikasi pembelajaran bahasa Inggris yang membantu pengguna meningkatkan kemampuan **Listening**, **Reading**, dan **Quiz** secara interaktif.

Aplikasi ini juga menyediakan fitur autentikasi pengguna, progress belajar, serta riwayat belajar yang terhubung dengan backend menggunakan REST API.

---

## ✨ Fitur

### 👤 Authentication
- Login
- Register
- Logout

### 📚 Learning
- Course List
- Course Detail
- Reading Exercise
- Listening Exercise
- Quiz

### 📊 Progress
- Learning Progress
- Learning History
- Score Result

### 👤 User
- Profile
- Edit Profile

---

# 🛠️ Teknologi yang Digunakan

## Frontend
- React Native
- Expo
- React Navigation
- Axios
- Context API

## Backend
- Node.js
- Express.js
- MySQL
- REST API

---

# 📂 Struktur Project

```
Project-Mobile-Programing
│
├── EnglishMate-Frontend
│   ├── assets
│   ├── src
│   │   ├── components
│   │   ├── constants
│   │   ├── context
│   │   ├── navigation
│   │   ├── screens
│   │   └── services
│   ├── App.js
│   └── package.json
│
├── EnglishMate-Backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── database
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 🚀 Cara Menjalankan Project

## 1. Clone Repository

```bash
git clone https://github.com/fathurXD/Project-Mobile-Programing.git
```

Masuk ke folder project

```bash
cd Project-Mobile-Programing
```

---

## 2. Menjalankan Backend

Masuk ke folder backend

```bash
cd EnglishMate-Backend
```

Install dependency

```bash
npm install
```

Jalankan server

```bash
npm start
```

atau

```bash
node server.js
```

---

## 3. Menjalankan Frontend

Masuk ke folder frontend

```bash
cd EnglishMate-Frontend
```

Install dependency

```bash
npm install
```

Jalankan Expo

```bash
npx expo start
```

Scan QR Code menggunakan aplikasi **Expo Go**.

---

# 🗄️ Database

Database menggunakan **MySQL**.

Import file:

```
database/schema.sql
```

Kemudian sesuaikan konfigurasi database pada file:

```
config/db.js
```

---

# 📸 Screenshot

## Login

> Tambahkan screenshot Login di sini.

---

## Home

> Tambahkan screenshot Home di sini.

---

## Course

> Tambahkan screenshot Course di sini.

---

## Quiz

> Tambahkan screenshot Quiz di sini.

---

## Learning History

> Tambahkan screenshot Learning History di sini.

---

# 👨‍💻 Developer

**Rafli Fathur**

Universitas Nahdlatul Ulama Yogyakarta

Program Studi Informatika

---

# 📄 License

Project ini dibuat untuk keperluan pembelajaran dan tugas UAS Mobile Programming.