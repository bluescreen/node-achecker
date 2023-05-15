const aChecker = require("accessibility-checker");
const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(express.json());

// Route to check accessibility
app.post("/check-accessibility", async (req, res) => {
  const { url } = req.body;
  const result = await runAccessibilityCheck(url);
  res.status(200).json({ success: true, result });
});

console.log("listening to ", port);
app.listen(port);

async function runAccessibilityCheck(url) {
  console.info("run achecker");
  const response = await aChecker.getCompliance(url, "/");

  const messages = response.report.results
    .filter((entry) => entry.message !== "Rule Passed")
    .map((entry) => entry.message)
    .reduce((acc, name) => {
      if (!acc.hasOwnProperty(name)) {
        acc[name] = 0;
      }
      acc[name]++;
      return acc;
    }, {});

  var groupedMessages = Object.keys(messages)
    .map((k) => {
      return { name: k, count: messages[k] };
    })
    .sort((a, b) => (a.count > b.count ? -1 : 1));

  aChecker.close();
  return groupedMessages.map((item) => "- " + item.name);
}
