const { runAccessibilityCheck } = require("./check");

const args = process.argv;
runAccessibilityCheck(args[2]).then((result) => {
  console.log(JSON.stringify(result));
});
