// Commandes d'information et de calcul (8 commandes)
const capitals = {
  france: "Paris", "côte d'ivoire": "Yamoussoukro", benin: "Porto-Novo", senegal: "Dakar",
  mali: "Bamako", togo: "Lomé", niger: "Niamey", "burkina faso": "Ouagadougou",
  cameroun: "Yaoundé", gabon: "Libreville", maroc: "Rabat", algerie: "Alger", tunisie: "Tunis",
  canada: "Ottawa", belgique: "Bruxelles", suisse: "Berne", japon: "Tokyo", "etats-unis": "Washington D.C.",
};
const flags = ["🇫🇷", "🇨🇮", "🇧🇯", "🇸🇳", "🇲🇱", "🇹🇬", "🇳🇪", "🇧🇫", "🇨🇲", "🇬🇦", "🇲🇦", "🇩🇿", "🇹🇳", "🇨🇦", "🇧🇪", "🇨🇭", "🇯🇵", "🇺🇸"];
const emojis = ["😀", "😂", "🥳", "😎", "🤩", "🥰", "🔥", "✨", "🎉", "💯", "🍓", "🌙", "⭐", "🌈", "🍀"];

function safeCalc(expr) {
  if (!/^[0-9+\-*/().\s%]+$/.test(expr)) throw new Error("invalid");
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${expr})`)();
}

module.exports = [
  {
    name: "time",
    async execute(sock, msg) {
      const now = new Date().toLocaleTimeString("fr-FR");
      await sock.sendMessage(msg.key.remoteJid, { text: `🕐 Heure actuelle : ${now}` }, { quoted: msg });
    },
  },
  {
    name: "date",
    async execute(sock, msg) {
      const now = new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      await sock.sendMessage(msg.key.remoteJid, { text: `📅 Date : ${now}` }, { quoted: msg });
    },
  },
  {
    name: "calc",
    async execute(sock, msg, args) {
      const expr = args.join(" ");
      if (!expr) return sock.sendMessage(msg.key.remoteJid, { text: "Utilise : 🍓calc 2+2*5" }, { quoted: msg });
      try {
        const result = safeCalc(expr);
        await sock.sendMessage(msg.key.remoteJid, { text: `🧮 ${expr} = ${result}` }, { quoted: msg });
      } catch {
        await sock.sendMessage(msg.key.remoteJid, { text: "❌ Expression invalide." }, { quoted: msg });
      }
    },
  },
  {
    name: "bmi",
    async execute(sock, msg, args) {
      const poids = parseFloat(args[0]);
      const taille = parseFloat(args[1]);
      if (!poids || !taille) {
        return sock.sendMessage(msg.key.remoteJid, { text: "Utilise : 🍓bmi <poids_kg> <taille_m> (ex: 70 1.75)" }, { quoted: msg });
      }
      const bmi = (poids / (taille * taille)).toFixed(1);
      await sock.sendMessage(msg.key.remoteJid, { text: `⚖️ IMC : ${bmi}` }, { quoted: msg });
    },
  },
  {
    name: "age",
    async execute(sock, msg, args) {
      const year = parseInt(args[0]);
      if (!year || year < 1900 || year > new Date().getFullYear()) {
        return sock.sendMessage(msg.key.remoteJid, { text: "Utilise : 🍓age <année_de_naissance> (ex: 2000)" }, { quoted: msg });
      }
      const age = new Date().getFullYear() - year;
      await sock.sendMessage(msg.key.remoteJid, { text: `🎂 Tu as environ ${age} ans.` }, { quoted: msg });
    },
  },
  {
    name: "capital",
    async execute(sock, msg, args) {
      const country = args.join(" ").toLowerCase();
      const cap = capitals[country];
      await sock.sendMessage(msg.key.remoteJid, { text: cap ? `🏛️ Capitale de ${country} : ${cap}` : "❌ Pays non trouvé dans ma base." }, { quoted: msg });
    },
  },
  {
    name: "flag",
    async execute(sock, msg) {
      const f = flags[Math.floor(Math.random() * flags.length)];
      await sock.sendMessage(msg.key.remoteJid, { text: `🏳️ Drapeau du jour : ${f}` }, { quoted: msg });
    },
  },
  {
    name: "emoji",
    async execute(sock, msg) {
      const e = emojis[Math.floor(Math.random() * emojis.length)];
      await sock.sendMessage(msg.key.remoteJid, { text: `Emoji aléatoire : ${e}` }, { quoted: msg });
    },
  },
];
