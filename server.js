/* eslint-disable */

const express = require("express");
const path = require("path");
const fs = require("fs").promises;

const port = 3000;
const folderPath = "/home/erica/Downloads/Ensaios";

const app = express();

app.use(express.static(path.join(__dirname, "dist")));
app.use("/files", express.static(folderPath));

app.get("/files", async (_, res) => {
  try {
    const files = await fs.readdir(folderPath);
    res.json({ files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
