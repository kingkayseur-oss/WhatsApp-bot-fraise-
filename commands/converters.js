// Convertisseurs et générateurs (14 commandes)
const crypto = require("crypto");

function getText(msg, args) {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const quotedText = quoted?.conversation || quoted?.extendedTextMessage?.text;
  return args.join(" ") || quotedText || "";
}

module.exports = [
  {
    name: "base64encode",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte." }, { quoted: msg });
      await sock.sendMessage(msg.key.remoteJid, { text: Buffer.from(text).toString("base64") }, { quoted: msg });
    },
  },
  {
    name: "base64decode",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte encodé." }, { quoted: msg });
      try {
        await sock.sendMessage(msg.key.remoteJid, { text: Buffer.from(text, "base64").toString("utf8") }, { quoted: msg });
      } catch {
        await sock.sendMessage(msg.key.remoteJid, { text: "❌ Texte base64 invalide." }, { quoted: msg });
      }
    },
  },
  {
    name: "md5",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte." }, { quoted: msg });
      await sock.sendMessage(msg.key.remoteJid, { text: crypto.createHash("md5").update(text).digest("hex") }, { quoted: msg });
    },
  },
  {
    name: "sha256",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte." }, { quoted: msg });
      await sock.sendMessage(msg.key.remoteJid, { text: crypto.createHash("sha256").update(text).digest("hex") }, { quoted: msg });
    },
  },
  {
    name: "hex",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte." }, { quoted: msg });
      await sock.sendMessage(msg.key.remoteJid, { text: Buffer.from(text).toString("hex") }, { quoted: msg });
    },
  },
  {
    name: "binary",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte." }, { quoted: msg });
      const bin = text.split("").map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
      await sock.sendMessage(msg.key.remoteJid, { text: bin }, { quoted: msg });
    },
  },
  {
    name: "encode",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte." }, { quoted: msg });
      await sock.sendMessage(msg.key.remoteJid, { text: encodeURIComponent(text) }, { quoted: msg });
    },
  },
  {
    name: "decode",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte encodé." }, { quoted: msg });
      try {
        await sock.sendMessage(msg.key.remoteJid, { text: decodeURIComponent(text) }, { quoted: msg });
      } catch {
        await sock.sendMessage(msg.key.remoteJid, { text: "❌ Texte invalide." }, { quoted: msg });
      }
    },
  },
  {
    name: "qrcode",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne le texte/lien à transformer en QR code." }, { quoted: msg });
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
      await sock.sendMessage(msg.key.remoteJid, { image: { url }, caption: "📱 Voici ton QR code." }, { quoted: msg });
    },
  },
  {
    name: "password",
    async execute(sock, msg, args) {
      const length = Math.min(Math.max(parseInt(args[0]) || 12, 6), 32);
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*";
      let pwd = "";
      for (let i = 0; i < length; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
      await sock.sendMessage(msg.key.remoteJid, { text: `🔑 Mot de passe généré : ${pwd}` }, { quoted: msg });
    },
  },
  {
    name: "username",
    async execute(sock, msg) {
      const adjectives = ["Dark", "Swift", "Silent", "Crazy", "Royal", "Shadow", "Golden", "Mystic"];
      const nouns = ["Wolf", "Phoenix", "Ninja", "Tiger", "King", "Storm", "Falcon", "Dragon"];
      const name = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 1000)}`;
      await sock.sendMessage(msg.key.remoteJid, { text: `👤 Pseudo généré : ${name}` }, { quoted: msg });
    },
  },
  {
    name: "color",
    async execute(sock, msg) {
      const hex = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
      await sock.sendMessage(msg.key.remoteJid, { text: `🎨 Couleur aléatoire : ${hex}` }, { quoted: msg });
    },
  },
  {
    name: "randomnumber",
    async execute(sock, msg, args) {
      const min = parseInt(args[0]) || 1;
      const max = parseInt(args[1]) || 100;
      const n = Math.floor(Math.random() * (max - min + 1)) + min;
      await sock.sendMessage(msg.key.remoteJid, { text: `🔢 Nombre aléatoire (${min}-${max}) : ${n}` }, { quoted: msg });
    },
  },
  {
    name: "choose",
    async execute(sock, msg, args) {
      const options = args.join(" ").split(",").map((s) => s.trim()).filter(Boolean);
      if (options.length < 2) {
        return sock.sendMessage(msg.key.remoteJid, { text: "Utilise : 🍓choose option1, option2, option3" }, { quoted: msg });
      }
      const pick = options[Math.floor(Math.random() * options.length)];
      await sock.sendMessage(msg.key.remoteJid, { text: `👉 Je choisis : ${pick}` }, { quoted: msg });
    },
  },
];
