const express = require("express");
const path = require("path");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const pino = require("pino");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

// Génère un pairing code pour connecter LE PROPRE compte de l'utilisateur
// qui appelle cette route (une session = un dossier d'auth distinct).
app.post("/api/pair", async (req, res) => {
  try {
    const { number } = req.body;
    if (!number || !/^\d{8,15}$/.test(number)) {
      return res.status(400).json({ error: "Numéro invalide. Utilise le format international sans + (ex: 2290000000)." });
    }

    const sessionId = `session_${number}_${Date.now()}`;
    const { state, saveCreds } = await useMultiFileAuthState(
      path.join(__dirname, "..", "auth", sessionId)
    );
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: "silent" }),
      browser: ["Fraise Bot", "Chrome", "1.0.0"],
    });

    sock.ev.on("creds.update", saveCreds);

    if (!sock.authState.creds.registered) {
      const code = await sock.requestPairingCode(number);
      return res.json({ code, sessionId });
    }

    return res.json({ message: "Déjà connecté." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la génération du code." });
  }
});

app.listen(PORT, () => console.log(`🌐 Site de connexion lancé sur le port ${PORT}`));
