import express from "express";
import cors from "cors";
import { generateNonce } from "siwe";

const app = express();
app.use(cors());
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/nonce/:address", async (req, res) => {
  const { address } = req.params;
  try {
    if (!address)
      return res.status(400).json({ message: "Address is required" });

    const user = {
      address: address,
      nonce: generateNonce(),
    };

    if (!user)
      return res.status(200).json({
        nonce: generateNonce(),
      });

    const nonce = user.nonce;

    return res.status(200).json({
      nonce,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
