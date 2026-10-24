// AFK, rappels et sondages (4 commandes)
const afkStore = new Map(); // jid -> { reason, since }

function isAfk(jid) {
  return afkStore.has(jid);
}

function getAfk(jid) {
  return afkStore.get(jid);
}

function clearAfk(jid) {
  afkStore.delete(jid);
}

// Si un membre AFK est mentionné, le bot prévient qu'il est absent
async function notifyIfAfkMentioned(sock, msg) {
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  for (const m of mentioned) {
    if (isAfk(m)) {
      const info = getAfk(m);
      const minutes = Math.floor((Date.now() - info.since) / 60000);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `💤 @${m.split("@")[0]} est AFK depuis ${minutes} min.\nRaison : ${info.reason}`,
        mentions: [m],
      });
    }
  }
}

// Si l'utilisateur AFK revient et écrit, on le signale et on retire son statut
async function clearAfkIfReturning(sock, msg, sender) {
  if (isAfk(sender)) {
    const info = getAfk(sender);
    const minutes = Math.floor((Date.now() - info.since) / 60000);
    clearAfk(sender);
    await sock.sendMessage(msg.key.remoteJid, { text: `👋 @${sender.split("@")[0]} n'est plus AFK (absence de ${minutes} min).`, mentions: [sender] });
  }
}

module.exports = {
  commandList: [
    {
      name: "afk",
      async execute(sock, msg, args, sender) {
        const reason = args.join(" ") || "Pas de raison précisée";
        afkStore.set(sender, { reason, since: Date.now() });
        await sock.sendMessage(msg.key.remoteJid, { text: `💤 Tu es maintenant AFK : ${reason}` }, { quoted: msg });
      },
    },
    {
      name: "unafk",
      async execute(sock, msg, args, sender) {
        clearAfk(sender);
        await sock.sendMessage(msg.key.remoteJid, { text: "✅ Statut AFK retiré." }, { quoted: msg });
      },
    },
    {
      name: "remind",
      async execute(sock, msg, args) {
        const minutes = parseFloat(args[0]);
        const text = args.slice(1).join(" ");
        if (!minutes || !text) {
          return sock.sendMessage(msg.key.remoteJid, { text: "Utilise : 🍓remind <minutes> <message> (ex: 🍓remind 10 boire de l'eau)" }, { quoted: msg });
        }
        await sock.sendMessage(msg.key.remoteJid, { text: `⏰ Rappel programmé dans ${minutes} min : "${text}"` }, { quoted: msg });
        setTimeout(() => {
          sock.sendMessage(msg.key.remoteJid, { text: `🔔 Rappel : ${text}` }).catch(() => {});
        }, minutes * 60 * 1000);
      },
    },
    {
      name: "poll",
      async execute(sock, msg, args) {
        const parts = args.join(" ").split("|").map((s) => s.trim()).filter(Boolean);
        if (parts.length < 3) {
          return sock.sendMessage(msg.key.remoteJid, { text: "Utilise : 🍓poll Question | Option1 | Option2 | ..." }, { quoted: msg });
        }
        const [question, ...options] = parts;
        const numberEmojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
        let text = `📊 ━『 𝐒𝐎𝐍𝐃𝐀𝐆𝐄 』━\n\n❓ ${question}\n\n`;
        options.forEach((opt, i) => {
          text += `${numberEmojis[i] || "🔹"} ${opt}\n`;
        });
        text += `\n💬 Répondez avec le numéro de votre choix.`;
        await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
      },
    },
  ],
  isAfk,
  notifyIfAfkMentioned,
  clearAfkIfReturning,
};
