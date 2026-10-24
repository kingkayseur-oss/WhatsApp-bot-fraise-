const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const path = require("path");
const config = require("./config");
const { handleGroupParticipantsUpdate } = require("./lib/welcome");

const menuCmd = require("./commands/menu");
const { ban, unban, kick, kickall } = require("./commands/moderation");
const stickerCmd = require("./commands/sticker");
const tagallCmd = require("./commands/tagall");
const antidelete = require("./commands/antidelete");
const antilag = require("./commands/antilag");
const cannedCommands = require("./commands/canned");
const gameCommands = require("./commands/games");
const textmemeCommands = require("./commands/textmeme");
const converterCommands = require("./commands/converters");
const infoCommands = require("./commands/info");
const groupmgmt = require("./commands/groupmgmt");
const systemCommands = require("./commands/system");
const afk = require("./commands/afk");
const fontCommands = require("./commands/fonts");
const stickerExtraCommands = require("./commands/stickerextra");

const baseCommands = [
  menuCmd,
  ban,
  unban,
  kick,
  kickall,
  stickerCmd,
  tagallCmd,
  antidelete,
  antilag,
  ...cannedCommands,
  ...gameCommands,
  ...textmemeCommands,
  ...converterCommands,
  ...infoCommands,
  ...groupmgmt.commandList,
  ...systemCommands,
  ...afk.commandList,
  ...fontCommands,
  ...stickerExtraCommands,
];

const commands = {};
for (const c of baseCommands) commands[c.name] = c;

console.log(`✅ ${Object.keys(commands).length} commandes chargées.`);

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.join(__dirname, "auth", config.sessionName)
  );
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    browser: ["Fraise Bot", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("Connexion fermée, reconnexion :", shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log("✅ Bot connecté avec succès !");
    }
  });

  sock.ev.on("group-participants.update", (update) =>
    handleGroupParticipantsUpdate(sock, update)
  );

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    antidelete.cacheMessage(msg);

    if (msg.message.protocolMessage?.type === 0) {
      return antidelete.handleMessageRevoke(sock, msg);
    }

    antilag.trackMessage(sock, msg).catch(() => {});

    const sender = msg.key.participant || msg.key.remoteJid;

    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      "";

    // AFK : prévenir si une personne AFK est mentionnée, et retirer le statut si elle revient
    afk.notifyIfAfkMentioned(sock, msg).catch(() => {});
    afk.clearAfkIfReturning(sock, msg, sender).catch(() => {});

    if (!body.startsWith(config.prefix)) return;

    const args = body.slice(config.prefix.length).trim().split(/\s+/);
    const cmdName = args.shift().toLowerCase();

    const command = commands[cmdName];
    if (!command) return;

    try {
      await command.execute(sock, msg, args, sender);
    } catch (err) {
      console.error(`Erreur commande ${cmdName}:`, err);
      await sock.sendMessage(
        msg.key.remoteJid,
        { text: "⚠️ Une erreur est survenue en exécutant cette commande." },
        { quoted: msg }
      );
    }
  });

  return sock;
}

startBot();
