// Commandes système / infos sur le bot (10 commandes)
const config = require("../config");
const startTime = Date.now();

function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

module.exports = [
  {
    name: "ping",
    async execute(sock, msg) {
      const start = Date.now();
      const sent = await sock.sendMessage(msg.key.remoteJid, { text: "🏓 Pong..." }, { quoted: msg });
      const latency = Date.now() - start;
      await sock.sendMessage(msg.key.remoteJid, { text: `🏓 Pong ! ${latency}ms` }, { edit: sent?.key });
    },
  },
  {
    name: "speed",
    async execute(sock, msg) {
      const start = Date.now();
      await sock.sendMessage(msg.key.remoteJid, { text: `⚡ Vitesse de réponse : ${Date.now() - start}ms` }, { quoted: msg });
    },
  },
  {
    name: "alive",
    async execute(sock, msg) {
      await sock.sendMessage(msg.key.remoteJid, { text: `✅ ${config.botName} est en ligne et fonctionne normalement !\n⏱️ Uptime : ${formatUptime(Date.now() - startTime)}` }, { quoted: msg });
    },
  },
  {
    name: "owner",
    async execute(sock, msg) {
      await sock.sendMessage(msg.key.remoteJid, { text: `👑 Créateur : ${config.ownerName}\n📡 Telegram : ${config.telegramLink}` }, { quoted: msg });
    },
  },
  {
    name: "runtime",
    async execute(sock, msg) {
      await sock.sendMessage(msg.key.remoteJid, { text: `⏱️ Le bot tourne depuis : ${formatUptime(Date.now() - startTime)}` }, { quoted: msg });
    },
  },
  {
    name: "report",
    async execute(sock, msg, args) {
      const problem = args.join(" ");
      if (!problem) return sock.sendMessage(msg.key.remoteJid, { text: "Utilise : 🍓report <décris le problème>" }, { quoted: msg });
      await sock.sendMessage(msg.key.remoteJid, { text: `✅ Signalement envoyé au créateur : "${problem}"` }, { quoted: msg });
    },
  },
  {
    name: "rules",
    async execute(sock, msg) {
      await sock.sendMessage(msg.key.remoteJid, { text: `📜 Règles :\n1. Respecte les membres.\n2. Pas de spam.\n3. Pas de liens non autorisés.\n4. Amuse-toi bien ! 🍓` }, { quoted: msg });
    },
  },
  {
    name: "support",
    async execute(sock, msg) {
      await sock.sendMessage(msg.key.remoteJid, { text: `🆘 Besoin d'aide ? Contacte ${config.ownerName} via Telegram : ${config.telegramLink}` }, { quoted: msg });
    },
  },
  {
    name: "donate",
    async execute(sock, msg) {
      await sock.sendMessage(msg.key.remoteJid, { text: `💝 Pour soutenir le développement du bot, contacte ${config.ownerName} sur Telegram : ${config.telegramLink}` }, { quoted: msg });
    },
  },
  {
    name: "setprefix",
    async execute(sock, msg, args) {
      await sock.sendMessage(msg.key.remoteJid, { text: `ℹ️ Le préfixe actuel est "${config.prefix}". Pour le changer définitivement, modifie la valeur "prefix" dans config.js puis redémarre le bot.` }, { quoted: msg });
    },
  },
];
