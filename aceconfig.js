module.exports = {
  DEBUG: true,
  ruleArchive: "latest",
  policies: ["WCAG_2_1"],
  failLevels: ["violation", "potentialviolation"],
  reportLevels: [
    "violation",
    "potentialviolation",
    // "recommendation",
    // "potentialrecommendation",
    // "manual",
    // "pass",
  ],
  outputFormat: ["json"],
  label: ["master"],
  outputFolder: "results",
  baselineFolder: "test/baselines",
  cacheFolder: "./cache",
};
