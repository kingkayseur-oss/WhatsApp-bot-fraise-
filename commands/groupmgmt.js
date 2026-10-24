// Gestion avancée de groupe (18 commandes)
const warnStore = new Map(); // jid_user -> count
const welcomeSettings = new Map(); // jid -> { welcomeOn, goodbyeOn, welcomeText, goodbyeText, antilink }
const slowmodeSettings = new Map(); // jid -> seconds (0 = off)

function isAdmin(metadata, jid) {
  const p = metadata.participants.find((x) => x.id === jid);
  return !!p?.admin;
}

async function requireAdmin(sock, msg, sender) {
  const jid = msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    await sock.sendMessage(jid, { text: "❌ Commande disponible seulement en groupe." }, { quoted: msg });
    return null;
  }
  const metadata = await sock.groupMetadata(jid);
  if (!isAdmin(metadata, sender)) {
    await sock.sendMessage(jid, { text: "❌ Réservé aux admins du groupe." }, { quoted: msg });
    return null;
  }
  return metadata;
}

function getMentioned(msg) {
  return msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
}

module.exports = {
  commandList: [
    {
      name: "promote",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        const mentioned = getMentioned(msg);
        if (!mentioned.length) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Mentionne la personne à promouvoir." }, { quoted: msg });
        await sock.groupParticipantsUpdate(msg.key.remoteJid, mentioned, "promote");
        await sock.sendMessage(msg.key.remoteJid, { text: "✅ Membre promu admin." }, { quoted: msg });
      },
    },
    {
      name: "demote",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        const mentioned = getMentioned(msg);
        if (!mentioned.length) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Mentionne la personne à rétrograder." }, { quoted: msg });
        await sock.groupParticipantsUpdate(msg.key.remoteJid, mentioned, "demote");
        await sock.sendMessage(msg.key.remoteJid, { text: "✅ Admin rétrogradé." }, { quoted: msg });
      },
    },
    {
      name: "mute",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        await sock.groupSettingUpdate(msg.key.remoteJid, "announcement");
        await sock.sendMessage(msg.key.remoteJid, { text: "🔇 Groupe mis en sourdine (seuls les admins écrivent)." }, { quoted: msg });
      },
    },
    {
      name: "unmute",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        await sock.groupSettingUpdate(msg.key.remoteJid, "not_announcement");
        await sock.sendMessage(msg.key.remoteJid, { text: "🔊 Groupe réactivé pour tous." }, { quoted: msg });
      },
    },
    {
      name: "warn",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        const mentioned = getMentioned(msg);
        if (!mentioned.length) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Mentionne la personne à avertir." }, { quoted: msg });
        const key = `${msg.key.remoteJid}_${mentioned[0]}`;
        const count = (warnStore.get(key) || 0) + 1;
        warnStore.set(key, count);
        let text = `⚠️ @${mentioned[0].split("@")[0]} averti (${count}/3).`;
        if (count >= 3) {
          await sock.groupParticipantsUpdate(msg.key.remoteJid, [mentioned[0]], "remove");
          text += " Limite atteinte, membre expulsé.";
          warnStore.delete(key);
        }
        await sock.sendMessage(msg.key.remoteJid, { text, mentions: mentioned }, { quoted: msg });
      },
    },
    {
      name: "resetwarn",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        const mentioned = getMentioned(msg);
        if (!mentioned.length) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Mentionne la personne." }, { quoted: msg });
        warnStore.delete(`${msg.key.remoteJid}_${mentioned[0]}`);
        await sock.sendMessage(msg.key.remoteJid, { text: "✅ Avertissements réinitialisés.", mentions: mentioned }, { quoted: msg });
      },
    },
    {
      name: "open",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        await sock.groupSettingUpdate(msg.key.remoteJid, "not_announcement");
        await sock.sendMessage(msg.key.remoteJid, { text: "🔓 Groupe ouvert à tous." }, { quoted: msg });
      },
    },
    {
      name: "close",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        await sock.groupSettingUpdate(msg.key.remoteJid, "announcement");
        await sock.sendMessage(msg.key.remoteJid, { text: "🔒 Groupe fermé (admins seulement)." }, { quoted: msg });
      },
    },
    {
      name: "link",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        const code = await sock.groupInviteCode(msg.key.remoteJid);
        await sock.sendMessage(msg.key.remoteJid, { text: `🔗 Lien d'invitation : https://chat.whatsapp.com/${code}` }, { quoted: msg });
      },
    },
    {
      name: "revoke",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        await sock.groupRevokeInvite(msg.key.remoteJid);
        await sock.sendMessage(msg.key.remoteJid, { text: "♻️ Lien d'invitation régénéré." }, { quoted: msg });
      },
    },
    {
      name: "setname",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        const name = args.join(" ");
        if (!name) return sock.sendMessage(msg.key.remoteJid, { text: "Utilise : 🍓setname <nouveau nom>" }, { quoted: msg });
        await sock.groupUpdateSubject(msg.key.remoteJid, name);
        await sock.sendMessage(msg.key.remoteJid, { text: "✅ Nom du groupe mis à jour." }, { quoted: msg });
      },
    },
    {
      name: "setdesc",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        const desc = args.join(" ");
        if (!desc) return sock.sendMessage(msg.key.remoteJid, { text: "Utilise : 🍓setdesc <nouvelle description>" }, { quoted: msg });
        await sock.groupUpdateDescription(msg.key.remoteJid, desc);
        await sock.sendMessage(msg.key.remoteJid, { text: "✅ Description mise à jour." }, { quoted: msg });
      },
    },
    {
      name: "setppic",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        const { downloadMediaMessage } = require("@whiskeysockets/baileys");
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted?.imageMessage) {
          return sock.sendMessage(msg.key.remoteJid, { text: "❌ Réponds à une image avec cette commande." }, { quoted: msg });
        }
        const buffer = await downloadMediaMessage({ message: quoted }, "buffer", {});
        await sock.updateProfilePicture(msg.key.remoteJid, buffer);
        await sock.sendMessage(msg.key.remoteJid, { text: "✅ Photo du groupe mise à jour." }, { quoted: msg });
      },
    },
    {
      name: "add",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        const number = args[0]?.replace(/[^0-9]/g, "");
        if (!number) return sock.sendMessage(msg.key.remoteJid, { text: "Utilise : 🍓add <numéro international sans +>" }, { quoted: msg });
        await sock.groupParticipantsUpdate(msg.key.remoteJid, [`${number}@s.whatsapp.net`], "add");
        await sock.sendMessage(msg.key.remoteJid, { text: "✅ Membre ajouté (si le numéro autorise l'ajout direct)." }, { quoted: msg });
      },
    },
    {
      name: "antilink",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        const mode = args[0]?.toLowerCase();
        if (!["on", "off"].includes(mode)) return sock.sendMessage(msg.key.remoteJid, { text: "Utilise : 🍓antilink on|off" }, { quoted: msg });
        const jid = msg.key.remoteJid;
        const s = welcomeSettings.get(jid) || {};
        s.antilink = mode === "on";
        welcomeSettings.set(jid, s);
        await sock.sendMessage(jid, { text: `✅ Antilink ${mode === "on" ? "activé" : "désactivé"}.` }, { quoted: msg });
      },
    },
    {
      name: "setwelcome",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        const text = args.join(" ");
        if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "Utilise : 🍓setwelcome <ton texte de bienvenue>" }, { quoted: msg });
        const jid = msg.key.remoteJid;
        const s = welcomeSettings.get(jid) || {};
        s.welcomeText = text;
        welcomeSettings.set(jid, s);
        await sock.sendMessage(jid, { text: "✅ Message de bienvenue personnalisé enregistré." }, { quoted: msg });
      },
    },
    {
      name: "setgoodbye",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        const text = args.join(" ");
        if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "Utilise : 🍓setgoodbye <ton texte d'au revoir>" }, { quoted: msg });
        const jid = msg.key.remoteJid;
        const s = welcomeSettings.get(jid) || {};
        s.goodbyeText = text;
        welcomeSettings.set(jid, s);
        await sock.sendMessage(jid, { text: "✅ Message d'au revoir personnalisé enregistré." }, { quoted: msg });
      },
    },
    {
      name: "slowmode",
      async execute(sock, msg, args, sender) {
        const metadata = await requireAdmin(sock, msg, sender);
        if (!metadata) return;
        const seconds = parseInt(args[0]);
        if (isNaN(seconds) || seconds < 0) return sock.sendMessage(msg.key.remoteJid, { text: "Utilise : 🍓slowmode <secondes> (0 pour désactiver)" }, { quoted: msg });
        slowmodeSettings.set(msg.key.remoteJid, seconds);
        await sock.sendMessage(msg.key.remoteJid, { text: seconds > 0 ? `🐢 Slowmode activé : 1 message / ${seconds}s.` : "✅ Slowmode désactivé." }, { quoted: msg });
      },
    },
  ],
  welcomeSettings,
  slowmodeSettings,
};
