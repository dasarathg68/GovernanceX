import cors from "cors";
import express from "express";
import Session from "express-session";
import { generateNonce, SiweMessage } from "siwe";

const app = express();
const PORT = 3000;

// configure cors and sessions
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  Session({
    name: "siwe-quickstart",
    secret: "siwe-quickstart-secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: true },
  })
);

app.get("/api/nonce", function (_, res) {
  res.setHeader("Content-Type", "text/plain");
  console.log("/nonce");
  res.send(generateNonce());
});

// verify the message
app.post("/api/verify", async (req, res) => {
  try {
    if (!req.body.message) {
      return res.status(400).json({ error: "SiweMessage is undefined" });
    }
    let SIWEObject = new SiweMessage(req.body.message);
    const { data: message } = await SIWEObject.verify({
      signature: req.body.signature,
      nonce: req.session.nonce,
    });

    const address = message.address;
    const chainId = message.chainId;

    // save the session with the address and chainId (SIWESession)
    req.session.siwe = { address, chainId };
    req.session.save(() => res.status(200).send(true));
  } catch (e) {
    // clean the session
    req.session.siwe = null;
    req.session.nonce = null;
    req.session.save(() => res.status(500).json({ message: e.message }));
  }
});

app.get("/api/session", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(req.session.siwe);
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
