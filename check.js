const aChecker = require("accessibility-checker");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

function calcScore(x, y) {
  return y / (x + y);
}

function calculateGrade(score) {
  if (score >= 90 && score <= 100) {
    return "Grade 1: Excellent";
  } else if (score >= 80 && score < 90) {
    return "Grade 2: Very Good";
  } else if (score >= 70 && score < 80) {
    return "Grade 3: Good";
  } else if (score >= 60 && score < 70) {
    return "Grade 4: Satisfactory";
  } else if (score >= 50 && score < 60) {
    return "Grade 5: Unsatisfactory";
  } else if (score >= 0 && score < 50) {
    return "Grade 6: Fail";
  } else {
    return "Invalid score";
  }
}

const scores = {
  violation: 10,
  potentialviolation: 6,
  recommendation: 4,
  potentialrecommendation: 2,
  manual: 1,
  pass: 0,
};

async function runAccessibilityCheck(url) {
  // if (!url.includes("http")) {
  //   url = "https://" + url;
  // }
  console.log("run acheck for ", url);
  const sourceResponse = await axios.get(url);

  const response = await aChecker.getCompliance(sourceResponse.data, "/");
  fs.writeFileSync(
    path.resolve("./results/report.json"),
    JSON.stringify(response.report)
  );

  const summary = response.report.summary;
  const numExecuted = response.report.numExecuted;

  const x = summary.counts.violation;
  const y = summary.counts.pass;

  const messages = response.report.results
    // .filter((entry) => entry.message !== "Rule Passed")
    .map((entry) => [entry.ruleId, entry.message, entry.level])
    .reduce((acc, [ruleId, message, level]) => {
      if (!acc.hasOwnProperty(ruleId)) {
        acc[ruleId] = { fail: 0, pass: 0, message: "" };
      }
      if (level === "pass") {
        acc[ruleId].pass++;
      } else {
        acc[ruleId].fail += scores[level];
        acc[ruleId].message = message;
      }
      return acc;
    }, {});

  var groupedMessages = Object.keys(messages)
    // .filter((k) => messages[k].fail > 0)
    .map((k) => {
      return {
        name: k,
        ...messages[k],
        score: calcScore(messages[k].fail, messages[k].pass),
      };
    })
    .sort((a, b) => (a.score > b.score ? -1 : 1));

  console.log("fail", x);
  console.log("pass", y);
  console.log("Counts", numExecuted);

  const mean = groupedMessages
    .filter((item) => item.score)
    .reduce((acc, item) => acc + item.score, 0);
  const score = mean / groupedMessages.length;

  console.log("Score", score);
  console.log("Grade", calculateGrade(score * 100));
  //console.log(groupedMessages);

  aChecker.close();
  const result = groupedMessages.map((item) => item.name);
  //console.log(groupedMessages);
  //console.timeEnd("achecker");

  return result;
}

module.exports = { runAccessibilityCheck };
