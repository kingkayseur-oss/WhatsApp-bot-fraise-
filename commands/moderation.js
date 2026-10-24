module.exports = {
  kick: {
    name: "kick",
    async execute(sock, msg, args) {
      const jid = msg.key.remoteJid;
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      if (!mentioned || mentioned.length === 0) {
        return sock.sendMessage(jid, { text: "❌ Mentionne la personne à expulser." }, { quoted: msg });
      }
      await sock.groupParticipantsUpdate(jid, mentioned, "remove");
      await sock.sendMessage(jid, { text: `✅ Membre expulsé du groupe.` }, { quoted: msg });
    },
  },
  kickall: {
    name: "purge at",
    async execute(sock, msg, args, sender) {
      const jid = msg.key.remoteJid;
      // Sécurité : seul l'admin/owner peut déclencher un kickall
      const metadata = await sock.groupMetadata(jid);
      const senderInfo = metadata.participants.find((p) => p.id === sender);
      if (!senderInfo?.admin) {
        return sock.sendMessage(jid, { text: "❌ Seuls les admins peuvent utiliser kickall." }, { quoted: msg });
      }
      const targets = args.length
        ? (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [])
        : metadata.participants.filter((p) => !p.admin).map((p) => p.id);

      if (!targets.length) {
        return sock.sendMessage(jid, { text: "❌ Aucun membre non-admin à expulser, ou mentionne les personnes voulues." }, { quoted: msg });
      }

      for (const t of targets) {
        try {
          await sock.groupParticipantsUpdate(jid, [t], "remove");
        } catch (e) {
          console.error("kickall error for", t, e);
        }
      }
      await sock.sendMessage(jid, { text: `✅ ${targets.length} membre(s) expulsé(s).` }, { quoted: msg });
    },
  },
  ban: {
    name: "ban",
    async execute(sock, msg, args) {
      const jid = msg.key.remoteJid;
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      if (!mentioned || mentioned.length === 0) {
        return sock.sendMessage(jid, { text: "❌ Mentionne la personne à bannir." }, { quoted: msg });
      }
      await sock.groupParticipantsUpdate(jid, mentioned, "remove");
      await sock.sendMessage(jid, { text: `✅ Membre banni.` }, { quoted: msg });
    },
  },
  unban: {
    name: "unban",
    async execute(sock, msg, args) {
      const jid = msg.key.remoteJid;
      const number = args[0]?.replace(/[^0-9]/g, "");
      if (!number) {
        return sock.sendMessage(jid, { text: "❌ Donne le numéro à débannir (ex: 2290000000)." }, { quoted: msg });
      }
      const target = `${number}@s.whatsapp.net`;
      await sock.groupParticipantsUpdate(jid, [target], "add");
      await sock.sendMessage(jid, { text: `✅ Membre réinvité.` }, { quoted: msg });
    },
  },
};
