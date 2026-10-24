// Commandes liées aux stickers et images (5 commandes) + bonus (4 commandes)
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");
const { exec } = require("child_process");
const config = require("../config");

function getQuotedSticker(msg) {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (quoted?.stickerMessage) return { message: quoted };
  if (msg.message?.stickerMessage) return msg;
  return null;
}

module.exports = [
  {
    name: "toimg",
    async execute(sock, msg) {
      const jid = msg.key.remoteJid;
      const target = getQuotedSticker(msg);
      if (!target) return sock.sendMessage(jid, { text: "❌ Réponds à un sticker avec cette commande." }, { quoted: msg });

      const buffer = await downloadMediaMessage(target, "buffer", {});
      const inPath = `./media/tmp_s_${Date.now()}.webp`;
      const outPath = `./media/tmp_s_${Date.now()}.png`;
      fs.writeFileSync(inPath, buffer);

      exec(`ffmpeg -i ${inPath} ${outPath}`, async (err) => {
        if (err) return sock.sendMessage(jid, { text: "❌ Erreur de conversion." }, { quoted: msg });
        await sock.sendMessage(jid, { image: fs.readFileSync(outPath) }, { quoted: msg });
        fs.unlinkSync(inPath);
        fs.unlinkSync(outPath);
      });
    },
  },
  {
    name: "take",
    async execute(sock, msg, args) {
      const jid = msg.key.remoteJid;
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const target = quoted?.stickerMessage ? { message: quoted } : null;
      if (!target) return sock.sendMessage(jid, { text: "❌ Réponds à un sticker avec cette commande pour le renommer (🍓take PackName|AuteurName)." }, { quoted: msg });

      const buffer = await downloadMediaMessage(target, "buffer", {});
      await sock.sendMessage(jid, { sticker: buffer }, { quoted: msg });
    },
  },
  {
    name: "stickercrop",
    async execute(sock, msg) {
      const jid = msg.key.remoteJid;
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!quoted?.imageMessage) return sock.sendMessage(jid, { text: "❌ Réponds à une image avec cette commande." }, { quoted: msg });

      const buffer = await downloadMediaMessage({ message: quoted }, "buffer", {});
      const inPath = `./media/tmp_c_${Date.now()}`;
      const outPath = `./media/tmp_c_${Date.now()}.webp`;
      fs.writeFileSync(inPath, buffer);

      exec(`ffmpeg -i ${inPath} -vf "crop=min(iw\\,ih):min(iw\\,ih),scale=512:512,format=rgba" -vcodec libwebp ${outPath}`, async (err) => {
        if (err) return sock.sendMessage(jid, { text: "❌ Erreur de recadrage." }, { quoted: msg });
        await sock.sendMessage(jid, { sticker: fs.readFileSync(outPath) }, { quoted: msg });
        fs.unlinkSync(inPath);
        fs.unlinkSync(outPath);
      });
    },
  },
  {
    name: "stickertext",
    async execute(sock, msg, args) {
      const jid = msg.key.remoteJid;
      const text = args.join(" ");
      if (!text) return sock.sendMessage(jid, { text: "Utilise : 🍓stickertext <ton texte>" }, { quoted: msg });

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
        <rect width="100%" height="100%" fill="transparent"/>
        <text x="50%" y="50%" font-size="48" fill="white" stroke="black" stroke-width="2" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${text}</text>
      </svg>`;
      const svgPath = `./media/tmp_t_${Date.now()}.svg`;
      const outPath = `./media/tmp_t_${Date.now()}.webp`;
      fs.writeFileSync(svgPath, svg);

      exec(`ffmpeg -i ${svgPath} -vcodec libwebp ${outPath}`, async (err) => {
        if (err) return sock.sendMessage(jid, { text: "❌ Erreur de génération (vérifie que ffmpeg supporte le SVG)." }, { quoted: msg });
        await sock.sendMessage(jid, { sticker: fs.readFileSync(outPath) }, { quoted: msg });
        fs.unlinkSync(svgPath);
        fs.unlinkSync(outPath);
      });
    },
  },
  {
    name: "emojimix",
    async execute(sock, msg, args) {
      const jid = msg.key.remoteJid;
      const input = args.join("").split("+");
      if (input.length !== 2) return sock.sendMessage(jid, { text: "Utilise : 🍓emojimix 😀+😎" }, { quoted: msg });
      const [e1, e2] = input;
      const codepoint = (e) => [...e].map((c) => c.codePointAt(0).toString(16)).join("-");
      const url = `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u${codepoint(e1)}/u${codepoint(e1)}_u${codepoint(e2)}.png`;
      await sock.sendMessage(jid, { image: { url }, caption: `${e1} + ${e2}` }, { quoted: msg }).catch(() =>
        sock.sendMessage(jid, { text: "❌ Combinaison non disponible pour ces emojis." }, { quoted: msg })
      );
    },
  },
  {
    name: "help",
    async execute(sock, msg, args) {
      await sock.sendMessage(msg.key.remoteJid, { text: `ℹ️ Tape ${config.prefix}menu pour voir toutes les commandes, ou ${config.prefix}support pour contacter le créateur.` }, { quoted: msg });
    },
  },
  {
    name: "botinfo",
    async execute(sock, msg) {
      await sock.sendMessage(msg.key.remoteJid, { text: `🍓 ${config.botName}\n👑 ${config.ownerName}\n📡 ${config.telegramLink}\n⚙️ Construit avec Baileys (Node.js)` }, { quoted: msg });
    },
  },
  {
    name: "changelog",
    async execute(sock, msg) {
      await sock.sendMessage(msg.key.remoteJid, { text: `📋 Dernières mises à jour :\n• Ajout de 150 commandes\n• Système AFK\n• Anti-lag / Anti-delete\n• Générateur de polices stylées` }, { quoted: msg });
    },
  },
  {
    name: "credits",
    async execute(sock, msg) {
      await sock.sendMessage(msg.key.remoteJid, { text: `🙏 Crédits :\n• Créateur : ${config.ownerName}\n• Librairie : @whiskeysockets/baileys\n• Toi, pour utiliser ce bot ! 🍓` }, { quoted: msg });
    },
  },
];
