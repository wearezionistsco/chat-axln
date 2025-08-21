const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// ================= CONFIG =================
const ADMIN = "6287756266682@c.us"; // ganti dengan nomor adminmu
const EXCLUDED_NUMBERS = [
  ADMIN,
  "6285179911407@c.us", // contoh
  "6289876543210@c.us"  // contoh
];

let IZIN_TELEPON = []; // daftar nomor yang diizinkan telepon

// ================= MENU =================
const menuUtama = `
📌 MENU UTAMA
1️⃣ TOP UP
2️⃣ PESAN PRIBADI
0️⃣ MENU
`;

const menuTopUp = `
💰 TOP UP
1. 150
2. 200
3. 300
4. 500
5. 1/2
6. 1
0. Kembali
`;

const menuPesanPribadi = `
✉ PESAN PRIBADI
1. Bon
2. Gadai
3. HP
4. Barang Lain
5. Telepon Admin
0. Kembali
`
