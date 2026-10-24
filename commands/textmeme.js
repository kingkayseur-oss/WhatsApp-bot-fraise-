// Transformations de texte (15 commandes)
function getText(msg, args) {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const quotedText = quoted?.conversation || quoted?.extendedTextMessage?.text;
  return args.join(" ") || quotedText || "";
}

module.exports = [
  {
    name: "reverse",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte." }, { quoted: msg });
      await sock.sendMessage(msg.key.remoteJid, { text: text.split("").reverse().join("") }, { quoted: msg });
    },
  },
  {
    name: "toupper",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      await sock.sendMessage(msg.key.remoteJid, { text: text.toUpperCase() || "❌ Donne un texte." }, { quoted: msg });
    },
  },
  {
    name: "tolower",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      await sock.sendMessage(msg.key.remoteJid, { text: text.toLowerCase() || "❌ Donne un texte." }, { quoted: msg });
    },
  },
  {
    name: "capitalize",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte." }, { quoted: msg });
      const result = text.replace(/\b\w/g, (c) => c.toUpperCase());
      await sock.sendMessage(msg.key.remoteJid, { text: result }, { quoted: msg });
    },
  },
  {
    name: "leetspeak",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte." }, { quoted: msg });
      const map = { a: "4", e: "3", i: "1", o: "0", s: "5", t: "7" };
      const result = text.toLowerCase().replace(/[aeiost]/g, (c) => map[c]);
      await sock.sendMessage(msg.key.remoteJid, { text: result }, { quoted: msg });
    },
  },
  {
    name: "owoify",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte." }, { quoted: msg });
      const result = text.replace(/[rl]/g, "w").replace(/[RL]/g, "W") + " uwu";
      await sock.sendMessage(msg.key.remoteJid, { text: result }, { quoted: msg });
    },
  },
  {
    name: "mock",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte." }, { quoted: msg });
      const result = text.split("").map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join("");
      await sock.sendMessage(msg.key.remoteJid, { text: result }, { quoted: msg });
    },
  },
  {
    name: "clap",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte." }, { quoted: msg });
      await sock.sendMessage(msg.key.remoteJid, { text: text.split(" ").join(" 👏 ") }, { quoted: msg });
    },
  },
  {
    name: "tableflip",
    async execute(sock, msg) {
      await sock.sendMessage(msg.key.remoteJid, { text: "(╯°□°）╯︵ ┻━┻" }, { quoted: msg });
    },
  },
  {
    name: "unflip",
    async execute(sock, msg) {
      await sock.sendMessage(msg.key.remoteJid, { text: "┬─┬ ノ( ゜-゜ノ)" }, { quoted: msg });
    },
  },
  {
    name: "shrug",
    async execute(sock, msg) {
      await sock.sendMessage(msg.key.remoteJid, { text: "¯\\_(ツ)_/¯" }, { quoted: msg });
    },
  },
  {
    name: "ascii",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte." }, { quoted: msg });
      const framed = `╔${"═".repeat(text.length + 2)}╗\n║ ${text} ║\n╚${"═".repeat(text.length + 2)}╝`;
      await sock.sendMessage(msg.key.remoteJid, { text: framed }, { quoted: msg });
    },
  },
  {
    name: "wordcount",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte." }, { quoted: msg });
      const words = text.trim().split(/\s+/).length;
      await sock.sendMessage(msg.key.remoteJid, { text: `📝 ${words} mot(s), ${text.length} caractère(s).` }, { quoted: msg });
    },
  },
  {
    name: "palindrome",
    async execute(sock, msg, args) {
      const text = getText(msg, args).toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte." }, { quoted: msg });
      const isPalindrome = text === text.split("").reverse().join("");
      await sock.sendMessage(msg.key.remoteJid, { text: isPalindrome ? "✅ C'est un palindrome !" : "❌ Ce n'est pas un palindrome." }, { quoted: msg });
    },
  },
  {
    name: "count",
    async execute(sock, msg, args) {
      const text = getText(msg, args);
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Donne un texte." }, { quoted: msg });
      await sock.sendMessage(msg.key.remoteJid, { text: `🔢 ${text.replace(/\s/g, "").length} caractère(s) (sans espaces).` }, { quoted: msg });
    },
  },
];
