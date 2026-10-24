const config = require("../config");

// Catégories alignées EXACTEMENT sur les commandes réellement implémentées (150 au total)
const categories = {
  "⚙️ GÉNÉRAL / SYSTÈME": ["menu", "ping", "speed", "alive", "owner", "runtime", "report", "rules", "support", "donate", "setprefix", "help", "botinfo", "changelog", "credits"],
  "🛡️ MODÉRATION": ["ban", "unban", "kick", "purge", "promote", "demote", "mute", "unmute", "warn", "resetwarn"],
  "🎉 GESTION DE GROUPE": ["open", "close", "link", "revoke", "setname", "setdesc", "setppic", "add", "antilink", "setwelcome", "setgoodbye", "slowmode", "tagall", "antidelete", "antilag"],
  "💤 AFK & RAPPELS": ["afk", "unafk", "remind", "poll"],
  "🎨 STICKERS & MÉDIAS": ["sticker", "toimg", "take", "stickercrop", "stickertext", "emojimix"],
  "🎮 JEUX & FUN": ["8ball", "dice", "coinflip", "rps", "ship", "simprate", "iq", "rate", "lovecalculator"],
  "💬 TEXTES ALÉATOIRES": ["quote", "fact", "joke", "proverb", "motivation", "advice", "horoscope", "zodiac", "pickupline", "flirt", "compliment", "roast", "animalfact", "spacefact", "historyfact", "sciencefact", "foodfact", "moviequote", "aesthetic", "wyr", "riddle", "trivia", "dare", "truth"],
  "🔤 TRANSFORMATION DE TEXTE": ["reverse", "toupper", "tolower", "capitalize", "leetspeak", "owoify", "mock", "clap", "tableflip", "unflip", "shrug", "ascii", "wordcount", "palindrome", "count"],
  "🔧 CONVERTISSEURS & OUTILS": ["base64encode", "base64decode", "md5", "sha256", "hex", "binary", "encode", "decode", "qrcode", "password", "username", "color", "randomnumber", "choose"],
  "ℹ️ INFOS & CALCUL": ["time", "date", "calc", "bmi", "age", "capital", "flag", "emoji"],
  "✒️ STYLES DE POLICE": ["bold", "italic", "bold-italic", "script", "gothic", "doublestruck", "monospace", "sans", "sans-bold", "sans-italic", "sans-bold-italic", "circled", "squared", "fullwidth", "smallcaps", "superscript", "subscript", "strikethrough", "underline", "negativecircled", "negativesquared", "currency", "upsidedown", "mirror", "wide", "zalgo", "dotted", "cursive", "boldscript", "serifbold"],
};

function buildMenuText(totalCommands, userName = "") {
  const line = "┏━━━━━━━━━━━━━━━━━┓";
  const endLine = "┗━━━━━━━━━━━━━━━━━┛";

  let txt = "";
  txt += `╭─❖「 ${config.botName} 」❖─╮\n`;
  txt += `│ 👑 Créateur : ${config.ownerName}\n`;
  txt += `│ 🍓 Préfixe : ${config.prefix}\n`;
  txt += `│ 📦 Commandes : ${totalCommands}\n`;
  txt += `│ 📡 Telegram : ${config.telegramLink}\n`;
  if (userName) txt += `│ 👤 Utilisateur : ${userName}\n`;
  txt += `╰────────────────╯\n\n`;

  for (const [cat, cmds] of Object.entries(categories)) {
    txt += `${line}\n`;
    txt += `┃  ${cat} (${cmds.length})\n`;
    txt += `${endLine}\n`;
    cmds.forEach((c) => {
      txt += `  ➤ ${config.prefix}${c}\n`;
    });
    txt += `\n`;
  }

  txt += `✨ _Tape ${config.prefix}help pour plus d'infos_ ✨`;
  return txt;
}

function countCommands() {
  return Object.values(categories).reduce((a, b) => a + b.length, 0);
}

function forwardedContextInfo(sock, jid) {
  return {
    contextInfo: {
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363000000000000@newsletter",
        newsletterName: config.botName,
        serverMessageId: 1,
      },
    },
  };
}

module.exports = { buildMenuText, countCommands, forwardedContextInfo, categories };
