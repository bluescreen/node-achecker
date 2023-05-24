const express = require("express");
const { spawn } = require("node:child_process");

const { runAccessibilityCheck } = require("./check");

async function runAsyncCheck(url) {
  return new Promise((resolve) => {
    const ls = spawn("node", ["run.js", url]);
    let result = "";
    ls.stdout.on("data", (data) => {
      result += `${data}`;
    });
    ls.on("exit", (data) => {
      resolve(result);
    });
  });
}

const app = express();
const port = 3020;

app.use(express.json());

// Route to check accessibility
app.post("/check-accessibility", async (req, res) => {
  try {
    const { url } = req.body;
    const result = JSON.parse(await runAsyncCheck(url));
    console.log(result);
    res.status(200).json({ success: true, result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: e });
  }
});

console.log("listening to ", port);
app.listen(port);
