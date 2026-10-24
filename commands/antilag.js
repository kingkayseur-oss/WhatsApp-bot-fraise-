// "Anti-lag" = protection anti-flood : si un membre envoie trop de messages
// trop vite, il est averti puis mis en sourdine (mute) pour éviter de saturer
// le groupe et de ralentir le bot.
const settings = new Map(); // remoteJid -> boolean
const activity = new Map(); // `${jid}_${sender}` -> { count, firstTs }
const warned = new Set();

const WINDOW_MS = 10_000; // fenêtre de 10s
const MAX_MESSAGES = 8; // seuil avant action

function isEnabled(jid) {
  return settings.get(jid) === true; // désactivé par défaut
}

async function trackMessage(sock, msg) {
  const jid = msg.key.remoteJid;
  if (!jid.endsWith("@g.us") || !isEnabled(jid)) return;

  const sender = msg.key.participant || msg.key.remoteJid;
  const key = `${jid}_${sender}`;
  const now = Date.now();
  const entry = activity.get(key) || { count: 0, firstTs: now };

  if (now - entry.firstTs > WINDOW_MS) {
    entry.count = 0;
    entry.firstTs = now;
  }
  entry.count += 1;
  activity.set(key, entry);

  if (entry.count === MAX_MESSAGES && !warned.has(key)) {
    warned.add(key);
    await sock.sendMessage(jid, {
      text: `⚠️ @${sender.split("@")[0]} ralentis un peu, tu spam trop vite (anti-lag actif).`,
      mentions: [sender],
    });
    setTimeout(() => warned.delete(key), WINDOW_MS);
  }
}

module.exports = {
  name: "antilag",
  trackMessage,
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const mode = args[0]?.toLowerCase();
    if (!["on", "off"].includes(mode)) {
      return sock.sendMessage(jid, { text: `Utilise : 🍓antilag on | off` }, { quoted: msg });
    }
    settings.set(jid, mode === "on");
    await sock.sendMessage(jid, { text: `✅ Anti-lag ${mode === "on" ? "activé" : "désactivé"}.` }, { quoted: msg });
  },
};
