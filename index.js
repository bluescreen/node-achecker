const express = require("express");
const { spawn } = require("node:child_process");

const { runAccessibilityCheck } = require("./check");

async function runAsyncCheck(url) {
  console.log("Check url ", url);

  return new Promise((resolve, reject) => {
    const ls = spawn("node", ["run.js", url], { timeout: 10000 });

    console.log("Spawn new proccess", ls.pid);
    console.time("p-" + ls.pid);
    let result = "";
    ls.stdout.on("data", (data) => {
      result += `${data}`;
    });
    ls.on("exit", (data) => {
      console.timeEnd("p-" + ls.pid);
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
    const response = await runAsyncCheck(url);
    // console.log(JSON.stringify(response, null, 2));
    const result = JSON.parse("'" + response + "'");
    res.status(200).json({ success: true, result });
  } catch (e) {
    console.error("Error", e);
    res.status(500).json({ success: false, message: e });
  }
});

console.log("listening to ", port);
app.listen(port);
