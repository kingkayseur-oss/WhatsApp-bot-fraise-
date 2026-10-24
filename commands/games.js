// Mini-jeux et commandes fun avec vraie logique (9 commandes)
function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

module.exports = [
  {
    name: "8ball",
    async execute(sock, msg, args) {
      const answers = ["Oui, certainement.", "C'est sûr.", "Je ne suis pas sûr.", "Demande plus tard.", "Non.", "Très probable.", "N'y compte pas.", "Difficile à dire."];
      const question = args.join(" ") || "...";
      await sock.sendMessage(msg.key.remoteJid, { text: `🎱 Question : ${question}\n💬 Réponse : ${rnd(answers)}` }, { quoted: msg });
    },
  },
  {
    name: "dice",
    async execute(sock, msg) {
      const result = Math.floor(Math.random() * 6) + 1;
      await sock.sendMessage(msg.key.remoteJid, { text: `🎲 Tu as fait un ${result} !` }, { quoted: msg });
    },
  },
  {
    name: "coinflip",
    async execute(sock, msg) {
      const result = rnd(["Pile", "Face"]);
      await sock.sendMessage(msg.key.remoteJid, { text: `🪙 Résultat : ${result}` }, { quoted: msg });
    },
  },
  {
    name: "rps",
    async execute(sock, msg, args) {
      const choices = ["pierre", "papier", "ciseaux"];
      const userChoice = args[0]?.toLowerCase();
      if (!choices.includes(userChoice)) {
        return sock.sendMessage(msg.key.remoteJid, { text: "Utilise : 🍓rps pierre|papier|ciseaux" }, { quoted: msg });
      }
      const botChoice = rnd(choices);
      let result;
      if (userChoice === botChoice) result = "Égalité !";
      else if (
        (userChoice === "pierre" && botChoice === "ciseaux") ||
        (userChoice === "papier" && botChoice === "pierre") ||
        (userChoice === "ciseaux" && botChoice === "papier")
      ) result = "Tu as gagné ! 🎉";
      else result = "Tu as perdu ! 🤖";
      await sock.sendMessage(msg.key.remoteJid, { text: `Toi : ${userChoice}\nBot : ${botChoice}\n${result}` }, { quoted: msg });
    },
  },
  {
    name: "ship",
    async execute(sock, msg, args) {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const percent = Math.floor(Math.random() * 101);
      const names = mentioned.length >= 2
        ? mentioned.map((m) => `@${m.split("@")[0]}`).join(" + ")
        : args.join(" ") || "???";
      await sock.sendMessage(msg.key.remoteJid, { text: `💘 ${names} = ${percent}% compatible`, mentions: mentioned }, { quoted: msg });
    },
  },
  {
    name: "simprate",
    async execute(sock, msg) {
      const percent = Math.floor(Math.random() * 101);
      await sock.sendMessage(msg.key.remoteJid, { text: `😳 Taux de simp : ${percent}%` }, { quoted: msg });
    },
  },
  {
    name: "iq",
    async execute(sock, msg) {
      const iq = Math.floor(Math.random() * 100) + 50;
      await sock.sendMessage(msg.key.remoteJid, { text: `🧠 QI estimé : ${iq}` }, { quoted: msg });
    },
  },
  {
    name: "rate",
    async execute(sock, msg, args) {
      const subject = args.join(" ") || "ça";
      const percent = Math.floor(Math.random() * 101);
      await sock.sendMessage(msg.key.remoteJid, { text: `⭐ Note pour "${subject}" : ${percent}/100` }, { quoted: msg });
    },
  },
  {
    name: "lovecalculator",
    async execute(sock, msg, args) {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const percent = Math.floor(Math.random() * 101);
      const names = mentioned.length >= 2 ? mentioned.map((m) => `@${m.split("@")[0]}`).join(" ❤️ ") : args.join(" ❤️ ") || "???";
      await sock.sendMessage(msg.key.remoteJid, { text: `💞 Calcul d'amour : ${names}\nRésultat : ${percent}%`, mentions: mentioned }, { quoted: msg });
    },
  },
];
