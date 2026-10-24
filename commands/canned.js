// Commandes à réponses aléatoires (24 commandes)
const bank = {
  quote: ["La vie est un défi à relever.", "Le succès, c'est tomber 7 fois et se relever 8.", "Crois en toi, même quand personne d'autre n'y croit.", "Chaque jour est une nouvelle chance.", "Les grandes choses prennent du temps."],
  fact: ["Le miel ne périme jamais.", "Les poulpes ont trois cœurs.", "Le cerveau humain utilise ~20% de l'énergie du corps.", "Les bananes sont des baies, pas les fraises.", "Le son voyage 4x plus vite dans l'eau que dans l'air."],
  joke: ["Pourquoi les plongeurs plongent-ils toujours en arrière ? Parce que sinon ils tombent dans le bateau.", "Qu'est-ce qu'un crocodile qui surveille une pharmacie ? Un Lacoste-garde.", "Pourquoi les poissons détestent l'ordinateur ? À cause des pop-up.", "J'ai raté mon examen d'astronomie... Je ne voyais pas où ça menait.", "Que dit un informaticien quand il s'ennuie en forêt ? Je m'arbre."],
  proverb: ["Petit à petit, l'oiseau fait son nid.", "Qui va à la chasse perd sa place.", "Mieux vaut tard que jamais.", "L'habit ne fait pas le moine.", "Pierre qui roule n'amasse pas mousse."],
  motivation: ["Lève-toi, aujourd'hui est à toi.", "Ne lâche rien, le meilleur arrive.", "Transforme tes doutes en force.", "Chaque effort compte, continue.", "Tu es plus capable que tu ne le penses."],
  advice: ["Écoute plus que tu ne parles.", "Prends soin de ta santé mentale.", "Investis en toi-même.", "Entoure-toi de gens positifs.", "Apprends de chaque échec."],
  horoscope: ["Aujourd'hui, la chance te sourit légèrement.", "Une surprise agréable t'attend.", "Reste prudent dans tes décisions financières.", "L'amour est dans l'air pour toi.", "Une bonne nouvelle arrive bientôt."],
  zodiac: ["Ton signe montre une grande détermination aujourd'hui.", "Les astres t'encouragent à être patient.", "Ton énergie est à son maximum cette semaine.", "Fais confiance à ton intuition.", "Un ami pourrait avoir besoin de toi."],
  pickupline: ["Si être beau/belle était un crime, tu serais en prison à vie.", "Es-tu un aimant ? Parce que je suis attiré(e) par toi.", "Crois-tu au coup de foudre ou je repasse ?", "Tu dois être fatigué(e), tu as couru dans mes pensées toute la journée.", "Mon GPS me dit que le bonheur est à côté de toi."],
  flirt: ["Tu illumines la pièce rien qu'en entrant.", "J'aime ta façon de voir la vie.", "Ton sourire est contagieux.", "Tu rends tout plus simple.", "On dirait que tu as volé des étoiles pour tes yeux."],
  compliment: ["Tu es quelqu'un de vraiment inspirant.", "Ta créativité n'a pas de limite.", "Tu as un cœur en or.", "Ta patience force le respect.", "Tu rends les gens autour de toi meilleurs."],
  roast: ["T'es tellement lent(e) que même le chargement de WhatsApp va plus vite.", "T'as un bug plus stable que ta connexion.", "Même le mode avion capte mieux que toi.", "T'es l'exception qui confirme qu'il y a des bugs partout.", "T'as plus de lag qu'un vieux téléphone."],
  animalfact: ["Les éléphants sont les seuls mammifères à ne pas pouvoir sauter.", "Les chats passent 70% de leur vie à dormir.", "Les girafes n'ont que 7 vertèbres cervicales, comme nous.", "Les fourmis ne dorment jamais vraiment.", "Les dauphins ont des noms pour s'appeler entre eux."],
  spacefact: ["Un jour sur Vénus dure plus longtemps qu'une année vénusienne.", "Le Soleil représente 99.8% de la masse du système solaire.", "Il y a plus d'étoiles que de grains de sable sur Terre.", "Saturne pourrait flotter sur l'eau.", "La Lune s'éloigne de la Terre de 3.8cm par an."],
  historyfact: ["La Grande Muraille de Chine mesure plus de 21000 km.", "Cléopâtre a vécu plus proche de nous que des pyramides.", "La Première Guerre mondiale a impliqué plus de 30 pays.", "Le papier a été inventé en Chine il y a plus de 2000 ans.", "L'imprimerie de Gutenberg a révolutionné le savoir au 15e siècle."],
  sciencefact: ["L'eau peut bouillir et geler en même temps (point triple).", "La lumière met 8 minutes à venir du Soleil.", "L'ADN humain est à 99.9% identique entre individus.", "Le corps humain contient environ 37 000 milliards de cellules.", "Le son ne voyage pas dans le vide."],
  foodfact: ["Le miel est le seul aliment qui ne périme jamais.", "Les carottes étaient violettes à l'origine.", "Le chocolat noir contient de la caféine.", "La pastèque est composée à 92% d'eau.", "Le riz est la base alimentaire de plus de la moitié du monde."],
  moviequote: ["« La vie est comme une boîte de chocolats. »", "« Avec de grands pouvoirs viennent de grandes responsabilités. »", "« Je reviendrai. »", "« Que la force soit avec toi. »", "« Il n'y a pas de problème qu'on ne puisse pas résoudre ensemble. »"],
  aesthetic: ["✨ 𝓼𝓸𝓯𝓽 𝓿𝓲𝓫𝓮𝓼 𝓸𝓷𝓵𝔂 ✨", "🌙 𝑑𝑟𝑒𝑎𝑚𝑦 𝑛𝑖𝑔�ℎ𝑡𝑠 🌙", "🍓 𝘴𝘸𝘦𝘦𝘵 𝘮𝘰𝘮𝘦𝘯𝘵𝘴 🍓", "🌸 𝖈𝖆𝖑𝖒 𝖒𝖎𝖓𝖉 🌸", "⭐ 𝚜𝚑𝚒𝚗𝚎 𝚋𝚛𝚒𝚐𝚑𝚝 ⭐"],
  wyr: ["Tu préfères être invisible ou voler ?", "Tu préfères lire les pensées ou voyager dans le temps ?", "Tu préfères vivre sans musique ou sans films ?", "Tu préfères être toujours en retard ou toujours trop en avance ?", "Tu préfères perdre ton téléphone ou ton portefeuille ?"],
  riddle: ["Je n'ai pas de voix mais je parle. Qui suis-je ? (Un livre)", "Plus je sèche, plus je deviens mouillé. Qui suis-je ? (Une serviette)", "Je tombe mais je ne me casse jamais. Qui suis-je ? (La nuit)", "J'ai des clés mais pas de serrure. Qui suis-je ? (Un piano)", "Plus on m'enlève, plus je grandis. Qui suis-je ? (Un trou)"],
  trivia: ["La tour Eiffel mesure 330 mètres.", "Le Japon a plus de 6800 îles.", "Le cœur humain bat environ 100 000 fois par jour.", "Il y a plus de 7000 langues parlées dans le monde.", "L'Everest grandit chaque année de quelques millimètres."],
  dare: ["Envoie un emoji au hasard dans le groupe.", "Écris ton message en MAJUSCULES pendant 2 minutes.", "Partage ta chanson préférée du moment (le titre).", "Envoie un compliment à la dernière personne qui a parlé.", "Raconte une blague dans le groupe."],
  truth: ["Quelle est ta plus grande peur ?", "Quel est ton plus grand rêve ?", "Quelle est la chose la plus folle que tu aies faite ?", "Qui admires-tu le plus et pourquoi ?", "Quel est ton plus grand regret ?"],
};

const commandList = Object.keys(bank).map((name) => ({
  name,
  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const arr = bank[name];
    const pick = arr[Math.floor(Math.random() * arr.length)];
    await sock.sendMessage(jid, { text: `🍓 ${pick}` }, { quoted: msg });
  },
}));

module.exports = commandList;
