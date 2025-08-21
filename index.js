const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Inisialisasi client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true }
});

// Nomor admin
const ADMIN = "628xxxxxxxxxx@c.us"; // ganti dengan nomor adminmu

// Daftar nomor yang dikecualikan (tidak auto-reply, boleh telepon tanpa izin)
const EXCLUDED_NUMBERS = [
  ADMIN,
  "6281234567890@c.us", // contoh
  "6289876543210@c.us"  // contoh
];

// Daftar nomor yang sudah dapat izin telepon
let IZIN_TELEPON = [];

// Menu utama
const menuUtama = `
📌 MENU UTAMA
1️⃣ TOP UP
2️⃣ PESAN PRIBADI
0️⃣ MENU
`;

// Submenu TOP UP
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

// Submenu PESAN PRIBADI
const menuPesanPribadi = `
✉ PESAN PRIBADI
1. Bon
2. Gadai
3. HP
4. Barang Lain
5. Telepon Admin
0. Kembali
`;

// Saat bot siap
client.on("qr", (qr) => qrcode.generate(qr, { small: true }));
client.on("ready", () => console.log("✅ Bot WhatsApp aktif!"));

// Handle chat
client.on("message", async (msg) => {
  const chat = msg.body.trim();

  // 🚫 Cek nomor yang dikecualikan
  if (EXCLUDED_NUMBERS.includes(msg.from)) {
    console.log("Chat dilewati dari:", msg.from);
    return;
  }

  // MENU
  if (chat === "menu" || chat === "0") {
    return msg.reply(menuUtama);
  }

  // --- MENU UTAMA ---
  if (chat === "1") return msg.reply(menuTopUp);
  if (chat === "2") return msg.reply(menuPesanPribadi);

  // --- SUB MENU TOP UP ---
  if (["1", "2", "3", "4", "5", "6"].includes(chat) && msg.body.length === 1) {
    let nominal;
    switch (chat) {
      case "1": nominal = "150"; break;
      case "2": nominal = "200"; break;
      case "3": nominal = "300"; break;
      case "4": nominal = "500"; break;
      case "5": nominal = "1/2"; break;
      case "6": nominal = "1"; break;
    }
    return msg.reply(✅ TOP UP ${nominal} diproses. Terima kasih!);
  }

  // --- SUB MENU PESAN PRIBADI ---
  if (chat === "1") return msg.reply("📌 Bon dicatat.");
  if (chat === "2") return msg.reply("📌 Gadai dicatat.");
  if (chat === "3") return msg.reply("📌 HP dicatat.");
  if (chat === "4") return msg.reply("📌 Barang lain dicatat.");
  if (chat === "5") {
    return msg.reply("📞 Permintaan telepon admin dikirim. Tunggu konfirmasi.");
  }

  // --- ADMIN IZIN / TOLAK TELEPON ---
  if (msg.from === ADMIN) {
    if (chat.startsWith("IZIN ")) {
      const nomor = chat.replace("IZIN ", "").trim() + "@c.us";
      if (!IZIN_TELEPON.includes(nomor)) IZIN_TELEPON.push(nomor);
      client.sendMessage(nomor, "✅ Kamu diizinkan telepon admin.");
      return msg.reply(Nomor ${nomor} diizinkan telepon.);
    }
    if (chat.startsWith("TOLAK ")) {
      const nomor = chat.replace("TOLAK ", "").trim() + "@c.us";
      IZIN_TELEPON = IZIN_TELEPON.filter((n) => n !== nomor);
      client.sendMessage(nomor, "❌ Izin telepon admin dicabut.");
      return msg.reply(Nomor ${nomor} ditolak telepon.);
    }
  }
});

// Handle panggilan masuk
client.on("call", async (call) => {
  // 🚫 Nomor dikecualikan → biarkan masuk
  if (EXCLUDED_NUMBERS.includes(call.from)) {
    console.log("Panggilan dilewati (dikecualikan):", call.from);
    return;
  }

  // 🚫 Default: tolak panggilan kalau belum izin
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

client.initialize();
