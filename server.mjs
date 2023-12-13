import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const config = await fs.readFile("./config.json", "utf-8").then(JSON.parse);

console.log(config);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = config.port;
const folderPath = config.photos.imageDir;

const app = express();

app.use(express.static(path.join(__dirname, "dist")));

app.use("/photos", express.static(folderPath));

app.get("/photos", async (_, res) => {
  try {
    const files = await fs.readdir(folderPath);
    const urls = files.map((file) => `/photos/${file}`);
    res.json({ urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
