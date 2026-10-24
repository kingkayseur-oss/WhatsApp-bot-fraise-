module.exports = {
  name: "tagall",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    if (!jid.endsWith("@g.us")) {
      return sock.sendMessage(jid, { text: "❌ Cette commande fonctionne seulement dans un groupe." }, { quoted: msg });
    }

    const metadata = await sock.groupMetadata(jid);
    const participants = metadata.participants.map((p) => p.id);
    const customText = args.join(" ");

    let text = `📢 ━━『 𝐓𝐀𝐆 𝐀𝐋𝐋 』━━ 📢\n\n`;
    if (customText) text += `💬 ${customText}\n\n`;
    participants.forEach((p) => {
      text += `➤ @${p.split("@")[0]}\n`;
    });

    await sock.sendMessage(jid, { text, mentions: participants }, { quoted: msg });
  },
};
