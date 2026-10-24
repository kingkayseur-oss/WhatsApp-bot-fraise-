const { buildMenuText, countCommands } = require("../lib/menu");

module.exports = {
  name: "menu",
  async execute(sock, msg, args, sender) {
    const jid = msg.key.remoteJid;
    const pushName = msg.pushName || "Utilisateur";
    const text = buildMenuText(countCommands(), pushName);

    await sock.sendMessage(
      jid,
      {
        image: { url: "./media/menu-banner.jpg" }, // remplace par ton image
        caption: text,
      },
      { quoted: msg }
    );
  },
};
