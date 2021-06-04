const https = require("https");
const fs = require("fs");
const { promisify } = require("util");
const path = require("path");

const utils = {
  pathToWrite: path.resolve(__dirname, "..", "content.txt"),
  writeFilePromise: promisify(fs.writeFile),
  urlToRead:
    "https://static-exp1.licdn.com/scds/common/u/images/promo/ads/li_evergreen_jobs_ad_300x250_v1.jpg",
};

const download = async (res) => {
  const data = [];

  res.on("data", (chunk) => {
    data.push(chunk);
  });

  res.on("close", async () => {
    console.log("File downloaded:");
    const bufferedContent = getBufferedContent(data);
    await writeFile(bufferedContent);
  });

  res.on("error", (error) => {
    console.log("Ocorreu um erro ao ler o arquivo");
    throw new Error(error);
  });
};

const getBufferedContent = (data) => {
  return Buffer.concat(data).toString("base64");
};

const writeFile = async (bufferedContent) => {
  try {
    await utils.writeFilePromise(utils.pathToWrite, bufferedContent);
    console.log(`File writted in path: ${utils.pathToWrite}`);
  } catch (err) {
    console.error(`Erro ao escrever arquivo \n ${err}`);
  }
};

((url) => {
  https.get(url, download);
})(utils.urlToRead);
