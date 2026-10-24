const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");
const { exec } = require("child_process");

module.exports = {
  name: "sticker",
  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const target = quoted ? { message: quoted } : msg;

    const mediaType = quoted
      ? Object.keys(quoted)[0]
      : Object.keys(msg.message || {})[0];

    if (!["imageMessage", "videoMessage"].includes(mediaType)) {
      return sock.sendMessage(jid, { text: "❌ Réponds à une image ou une courte vidéo avec cette commande." }, { quoted: msg });
    }

    const buffer = await downloadMediaMessage(target, "buffer", {});
    const inPath = `./media/tmp_in_${Date.now()}`;
    const outPath = `./media/tmp_out_${Date.now()}.webp`;
    fs.writeFileSync(inPath, buffer);

    // Nécessite ffmpeg installé sur le serveur d'hébergement
    exec(`ffmpeg -i ${inPath} -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -vcodec libwebp ${outPath}`, async (err) => {
      if (err) {
        console.error(err);
        return sock.sendMessage(jid, { text: "❌ Erreur lors de la création du sticker." }, { quoted: msg });
      }
      await sock.sendMessage(jid, { sticker: fs.readFileSync(outPath) }, { quoted: msg });
      fs.unlinkSync(inPath);
      fs.unlinkSync(outPath);
    });
  },
};
