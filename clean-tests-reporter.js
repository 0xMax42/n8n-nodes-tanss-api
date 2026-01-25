const path = require("path");

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

class CleanTestsReporter {
  onRunComplete(_, results) {
    let passedFiles = 0;
    let failedFiles = 0;

    for (const suite of results.testResults) {
      const relativePath = path.relative(process.cwd(), suite.testFilePath);

      const hasFailures = suite.numFailingTests > 0;
      if (hasFailures) failedFiles++;
      else passedFiles++;

      console.log(`\n${relativePath}`);

      const grouped = new Map();

      for (const test of suite.testResults) {
        const group = test.ancestorTitles.join(" › ") || "(root)";
        if (!grouped.has(group)) grouped.set(group, []);
        grouped.get(group).push(test);
      }

      for (const [groupName, tests] of grouped.entries()) {
        console.log(`  ${groupName}`);

        for (const test of tests) {
          const passed = test.status === "passed";
          const symbol = passed ? "✓" : "✕";
          const color = passed ? GREEN : RED;

          console.log(`    ${color}${symbol}${RESET} ${test.title}`);
        }
      }
    }

    // Global summary
    const totalFiles = passedFiles + failedFiles;

    console.log(`\n${DIM}────────────────────────────────────────${RESET}`);
    console.log(`${CYAN}Test Files Summary${RESET}`);
    console.log(`  ${GREEN}PASS${RESET}  ${passedFiles} files`);
    console.log(`  ${RED}FAIL${RESET}  ${failedFiles} files`);
    console.log(`  TOTAL ${totalFiles} files`);
  }
}

module.exports = CleanTestsReporter;
