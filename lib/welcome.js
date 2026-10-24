// Gère les événements group-participants.update (entrée / sortie)
async function handleGroupParticipantsUpdate(sock, update) {
  try {
    const { id: groupId, participants, action } = update;
    const metadata = await sock.groupMetadata(groupId);
    const groupName = metadata.subject;
    const groupDesc = metadata.desc || "Aucune description";
    const memberCount = metadata.participants.length;

    for (const participant of participants) {
      let pfp;
      try {
        pfp = await sock.profilePictureUrl(participant, "image");
      } catch {
        pfp = "https://i.imgur.com/6V4oE9a.png"; // image par défaut
      }

      if (action === "add") {
        const text =
          `✨ ━━━『 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐔𝐄 』━━━ ✨\n\n` +
          `👋 Salut @${participant.split("@")[0]} !\n` +
          `🏠 Groupe : ${groupName}\n` +
          `👥 Membres : ${memberCount}\n` +
          `📝 Description : ${groupDesc}\n\n` +
          `🎉 Profite bien de ton séjour parmi nous !`;

        await sock.sendMessage(groupId, {
          image: { url: pfp },
          caption: text,
          mentions: [participant],
        });
      } else if (action === "remove") {
        const text =
          `👋 ━━━『 𝐀𝐔 𝐑𝐄𝐕𝐎𝐈𝐑 』━━━ 👋\n\n` +
          `😢 @${participant.split("@")[0]} a quitté le groupe.\n` +
          `🏠 Groupe : ${groupName}\n\n` +
          `✌️ À bientôt peut-être !`;

        await sock.sendMessage(groupId, {
          image: { url: pfp },
          caption: text,
          mentions: [participant],
        });
      }
    }
  } catch (err) {
    console.error("Erreur welcome/goodbye:", err);
  }
}

module.exports = { handleGroupParticipantsUpdate };
