const { Client, LocalAuth } = require("whatsapp-web.js");

// ================= CONFIG =================

// Nomor admin
const ADMIN = "6287756266682@c.us"; // ganti dengan nomor adminmu

// Nomor yang dikecualikan (boleh chat/telepon tanpa auto-reply)
const EXCLUDED_NUMBERS = [
  ADMIN,
  "6285179911407@c.us", // contoh
  "6289876543210@c.us"  // contoh
];

// Daftar nomor yang sudah dapat izin telepon
let IZIN_TELEPON = [];

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
`;

// ================= CLIENT =================
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    // ⚡ Pakai Chromium dari Docker, bukan Chromium internal Puppeteer
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu"
    ],
  },
});

// QR untuk Railway (pakai link image)
client.on("qr", (qr) => {
  console.log("🔑 Scan QR Code ini:");
  console.log("https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + qr);
});

client.on("ready", () => console.log("✅ Bot WhatsApp aktif!"));

// ================= HANDLER CHAT =================
client.on("message", async (msg) => {
  const chat = msg.body.trim();

  // 🚫 Skip jika nomor ada di excluded
  if (EXCLUDED_NUMBERS.includes(msg.from)) {
    console.log("Chat dilewati dari:", msg.from);
    return;
  }

  // --- MENU UTAMA ---
  if (chat === "menu" || chat === "0") return msg.reply(menuUtama);
  if (chat === "1") return msg.reply(menuTopUp);
  if (chat === "2") return msg.reply(menuPesanPribadi);

  // --- SUB MENU TOP UP ---
  if (["1","2","3","4","5","6"].includes(chat) && msg.body.length === 1) {
    const nominal = ["150","200","300","500","1/2","1"][parseInt(chat)-1];
    return msg.reply(`✅ TOP UP ${nominal} diproses. Terima kasih!`);
  }

  // --- SUB MENU PESAN PRIBADI ---
  if (chat === "1") return msg.reply("📌 Bon dicatat.");
  if (chat === "2") return msg.reply("📌 Gadai dicatat.");
  if (chat === "3") return msg.reply("📌 HP dicatat.");
  if (chat === "4") return msg.reply("📌 Barang lain dicatat.");
  if (chat === "5") return msg.reply("📞 Permintaan telepon admin dikirim. Tunggu konfirmasi.");

  // --- ADMIN IZIN / TOLAK TELEPON ---
  if (msg.from === ADMIN) {
    if (chat.startsWith("IZIN ")) {
      const nomor = chat.replace("IZIN ", "").trim() + "@c.us";
      if (!IZIN_TELEPON.includes(nomor)) IZIN_TELEPON.push(nomor);
      client.sendMessage(nomor, "✅ Kamu diizinkan telepon admin.");
      return msg.reply(`Nomor ${nomor} diizinkan telepon.`);
    }
    if (chat.startsWith("TOLAK ")) {
      const nomor = chat.replace("TOLAK ", "").trim() + "@c.us";
      IZIN_TELEPON = IZIN_TELEPON.filter((n) => n !== nomor);
      client.sendMessage(nomor, "❌ Izin telepon admin dicabut.");
      return msg.reply(`Nomor ${nomor} ditolak telepon.`);
    }
  }
});

// ================= HANDLER PANGGILAN =================
client.on("call", async (call) => {
  if (EXCLUDED_NUMBERS.includes(call.from)) {
    console.log("Panggilan dilewati (dikecualikan):", call.from);
    return;
  }

  if (!IZIN_TELEPON.includes(call.from)) {
    await call.reject();
    client.sendMessage(
      call.from,
      "❌ Maaf, panggilan ke admin tidak diizinkan.\nKetik 2 > 5 untuk minta izin telepon."
    );
    console.log("Panggilan ditolak dari:", call.from);
  } else {
    console.log("Panggilan diizinkan dari:", call.from);
  }
});

// Jalankan bot
client.initialize();
