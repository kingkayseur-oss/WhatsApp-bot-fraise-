// Stocke les derniers messages en mémoire pour pouvoir les renvoyer s'ils sont supprimés.
// Pour un usage en production, préfère une vraie base de données (ex: SQLite).
const store = new Map(); // key: `${remoteJid}_${id}` -> message complet
const settings = new Map(); // key: remoteJid -> boolean (activé/désactivé)

const MAX_STORE = 2000;

function cacheMessage(msg) {
  if (!msg.message) return;
  const key = `${msg.key.remoteJid}_${msg.key.id}`;
  store.set(key, msg);
  if (store.size > MAX_STORE) {
    const firstKey = store.keys().next().value;
    store.delete(firstKey);
  }
}

function isEnabled(jid) {
  return settings.get(jid) !== false; // activé par défaut
}

async function handleMessageRevoke(sock, revocation) {
  const jid = revocation.key.remoteJid;
  if (!isEnabled(jid)) return;

  const key = `${jid}_${revocation.message?.protocolMessage?.key?.id}`;
  const original = store.get(key);
  if (!original) return;

  const senderJid = original.key.participant || original.key.remoteJid;
  const text =
    original.message.conversation ||
    original.message.extendedTextMessage?.text ||
    "[média ou message non textuel]";

  await sock.sendMessage(jid, {
    text: `🗑️ ━『 𝐌𝐄𝐒𝐒𝐀𝐆𝐄 𝐒𝐔𝐏𝐏𝐑𝐈𝐌É 』━\n\n👤 Par : @${senderJid.split("@")[0]}\n💬 Contenu : ${text}`,
    mentions: [senderJid],
  });
}

module.exports = {
  name: "antidelete",
  cacheMessage,
  handleMessageRevoke,
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const mode = args[0]?.toLowerCase();
    if (!["on", "off"].includes(mode)) {
      return sock.sendMessage(jid, { text: `Utilise : 🍓antidelete on | off` }, { quoted: msg });
    }
    settings.set(jid, mode === "on");
    await sock.sendMessage(jid, { text: `✅ Anti-delete ${mode === "on" ? "activé" : "désactivé"}.` }, { quoted: msg });
  },
};
