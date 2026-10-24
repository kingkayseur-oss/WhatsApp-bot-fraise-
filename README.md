# Fraise Bot — WhatsApp (150 commandes, base légitime)

## Résumé
150 commandes réellement codées (pas de placeholders) : modération, gestion de groupe, AFK, stickers, mini-jeux, textes aléatoires, transformations de texte, convertisseurs, infos/calcul, et 30 styles de police stylée.

## Catégories et nombre de commandes
- ⚙️ Général / Système : 15 (menu, ping, speed, alive, owner, runtime, report, rules, support, donate, setprefix, help, botinfo, changelog, credits)
- 🛡️ Modération : 10 (ban, unban, kick, kickall, promote, demote, mute, unmute, warn, resetwarn)
- 🎉 Gestion de groupe : 15 (open, close, link, revoke, setname, setdesc, setppic, add, antilink, setwelcome, setgoodbye, slowmode, tagall, antidelete, antilag)
- 💤 AFK & rappels : 4 (afk, unafk, remind, poll)
- 🎨 Stickers & médias : 6 (sticker, toimg, take, stickercrop, stickertext, emojimix)
- 🎮 Jeux & fun : 9 (8ball, dice, coinflip, rps, ship, simprate, iq, rate, lovecalculator)
- 💬 Textes aléatoires : 24 (quote, fact, joke, proverb, motivation, advice, horoscope, zodiac, pickupline, flirt, compliment, roast, animalfact, spacefact, historyfact, sciencefact, foodfact, moviequote, aesthetic, wyr, riddle, trivia, dare, truth)
- 🔤 Transformation de texte : 15 (reverse, toupper, tolower, capitalize, leetspeak, owoify, mock, clap, tableflip, unflip, shrug, ascii, wordcount, palindrome, count)
- 🔧 Convertisseurs & outils : 14 (base64encode, base64decode, md5, sha256, hex, binary, encode, decode, qrcode, password, username, color, randomnumber, choose)
- ℹ️ Infos & calcul : 8 (time, date, calc, bmi, age, capital, flag, emoji)
- ✒️ Styles de police : 30 (bold, italic, bold-italic, script, gothic, doublestruck, monospace, sans, sans-bold, sans-italic, sans-bold-italic, circled, squared, fullwidth, smallcaps, superscript, subscript, strikethrough, underline, negativecircled, negativesquared, currency, upsidedown, mirror, wide, zalgo, dotted, cursive, boldscript, serifbold)

**Total : 150 commandes**, toutes avec une vraie fonction `execute()` (vérifié automatiquement, aucun doublon de nom).

## Ce qui N'est PAS inclus (volontairement)
- Téléchargement ou streaming de musique/vidéos (YouTube, Spotify, TikTok), films, Netflix, mangas : contenus protégés par le droit d'auteur.
- Vidéo de fond réelle avec des personnes identifiables sur le site web : remplacée par un fond animé.

## Installation
```bash
npm install
npm start        # lance le bot (QR affiché dans le terminal pour un 1er test local)
npm run web       # lance le site de connexion par pairing code (port 3000)
```
Nécessite `ffmpeg` installé sur le serveur pour les commandes stickers (sticker, toimg, stickercrop, stickertext).

## Déploiement
- Pousse ce dossier sur GitHub.
- Déploie sur ton hébergeur Node.js (connexions WebSocket persistantes + `ffmpeg`).
- Le site (`web/server.js`) et le bot (`index.js`) tournent comme deux process séparés.

## Ajouter tes propres commandes
Crée un fichier dans `commands/`, exporte `{ name, execute(sock, msg, args, sender) }` (ou un tableau de plusieurs commandes), importe-le dans `index.js`, ajoute-le à `baseCommands`, puis ajoute son nom dans la bonne catégorie de `lib/menu.js`.
