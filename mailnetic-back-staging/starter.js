const express = require("express");
const app = express();
const port = 3000;
const Moralis = rquire("moralis").default;
require("dotenv").config();

app.use(express.json());

app.post("/webhook", async (req, res) => {
  const { body, header } = req;

  console.log(body);

  try {
    Moralis.Streams.verifySignature({
      body,
      signature: header["x-signature"],
    });
    return res.status(200).json();
  } catch (err) {
    console.log("NOT MORALIS");
    return res.status(400).json();
  }
});

Moralis.start({ apiKey: process.env.MORALIS_API_KEY }).then(() => {
  app.listen(port, () => {
    console.log(`Listening to streams`);
  });
});
