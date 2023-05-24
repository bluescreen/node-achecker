const aChecker = require("accessibility-checker");

async function runAccessibilityCheck(url) {
  if (!url.includes("http")) {
    url = "https://" + url;
  }

  const response = await aChecker.getCompliance(url, "/");
  //console.log(response.report);
  //console.log("Tests", response.report.numExecuted);

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
  const result = groupedMessages.map((item) => item.name);
  //console.log(groupedMessages);
  //console.timeEnd("achecker");

  return result;
}

module.exports = { runAccessibilityCheck };
