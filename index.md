# Test Results
  ## Summary
  
| :clock10: Start time | :hourglass: Duration |
| --- | ---: |
|8/20/2024, 4:32:49 PM|18.20s|

| | :white_check_mark: Passed | :x: Failed | :construction: Todo | :white_circle: Total |
| --- | ---: | ---: | ---:| ---: |
|Test Suites|2|1|-|3|
|Tests|4|4|0|8|



  ---
  ## Tests Details
  ### tests/homepage.copyright.test.ts
<table>
<tr><th>Test</th><th>Status</th><th>Time</th></tr>
<tr><td>Homepage footer manual validation:Check if the footer copyright contains correct version</td><td>:white_check_mark:</td><td>52ms</td></tr>
<tr><td>Homepage footer manual validation:Check if the footer coypright contains correct year</td><td>:white_check_mark:</td><td>6ms</td></tr>
</table>

### tests/test.feature
<table>
<tr><th>Test</th><th>Status</th><th>Time</th></tr>
<tr><td>Feature: Test page looks fine:test page screen</td><td>:white_check_mark:</td><td>2.382s</td></tr>
</table>

### tests/homepage.feature
<table>
<tr><th>Test</th><th>Status</th><th>Time</th></tr>
<tr><td>Feature: Homepage looks fine:test homepage screen</td><td>:white_check_mark:</td><td>2.643s</td></tr>
<tr><td>Feature: Homepage looks fine:test homepage screen on mobile</td><td>:x:</td><td>2.763s</td></tr>
<tr><td colspan="3">
```text
Error: Image mismatch found: /home/runner/work/esl/esl/e2e/.diff/feature-homepage-looks-fine-test-homepage-screen-diff.webp
    at /home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:36:17
    at Generator.next (<anonymous>)
    at /home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:8:71
    at new Promise (<anonymous>)
    at Object.<anonymous>.__awaiter (/home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:4:12)
    at /home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:33:117
    at Cucumber.convertHandler (/home/runner/work/esl/esl/node_modules/stucumber/src/cucumber.ts:183:11)
    at Cucumber.<anonymous> (/home/runner/work/esl/esl/node_modules/stucumber/src/cucumber.ts:214:30)
    at Generator.next (<anonymous>)
    at /home/runner/work/esl/esl/node_modules/stucumber/dist/cucumber.js:7:71
    at new Promise (<anonymous>)
    at Object.<anonymous>.__awaiter (/home/runner/work/esl/esl/node_modules/stucumber/dist/cucumber.js:3:12)
    at Cucumber.rule (/home/runner/work/esl/esl/node_modules/stucumber/dist/cucumber.js:102:16)
    at /home/runner/work/esl/esl/e2e/tests/homepage.feature:7:10
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
```
</td></tr>
<tr><td>Feature: Homepage looks fine:test homepage hamburger menu on mobile</td><td>:x:</td><td>3.258s</td></tr>
<tr><td colspan="3">
```text
Error: Image mismatch found: /home/runner/work/esl/esl/e2e/.diff/feature-homepage-looks-fine-test-homepage-screen-on-mobile-diff.webp
    at /home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:36:17
    at Generator.next (<anonymous>)
    at /home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:8:71
    at new Promise (<anonymous>)
    at Object.<anonymous>.__awaiter (/home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:4:12)
    at /home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:33:117
    at Cucumber.convertHandler (/home/runner/work/esl/esl/node_modules/stucumber/src/cucumber.ts:183:11)
    at Cucumber.<anonymous> (/home/runner/work/esl/esl/node_modules/stucumber/src/cucumber.ts:214:30)
    at Generator.next (<anonymous>)
    at /home/runner/work/esl/esl/node_modules/stucumber/dist/cucumber.js:7:71
    at new Promise (<anonymous>)
    at Object.<anonymous>.__awaiter (/home/runner/work/esl/esl/node_modules/stucumber/dist/cucumber.js:3:12)
    at Cucumber.rule (/home/runner/work/esl/esl/node_modules/stucumber/dist/cucumber.js:102:16)
    at /home/runner/work/esl/esl/e2e/tests/homepage.feature:14:10
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
```
</td></tr>
<tr><td>Feature: Homepage looks fine:test homepage footer on desktop</td><td>:x:</td><td>2.339s</td></tr>
<tr><td colspan="3">
```text
Error: Image mismatch found: /home/runner/work/esl/esl/e2e/.diff/feature-homepage-looks-fine-test-homepage-hamburger-menu-on-mobile-diff.webp
    at /home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:36:17
    at Generator.next (<anonymous>)
    at /home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:8:71
    at new Promise (<anonymous>)
    at Object.<anonymous>.__awaiter (/home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:4:12)
    at /home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:33:117
    at Cucumber.convertHandler (/home/runner/work/esl/esl/node_modules/stucumber/src/cucumber.ts:183:11)
    at Cucumber.<anonymous> (/home/runner/work/esl/esl/node_modules/stucumber/src/cucumber.ts:214:30)
    at Generator.next (<anonymous>)
    at /home/runner/work/esl/esl/node_modules/stucumber/dist/cucumber.js:7:71
    at new Promise (<anonymous>)
    at Object.<anonymous>.__awaiter (/home/runner/work/esl/esl/node_modules/stucumber/dist/cucumber.js:3:12)
    at Cucumber.rule (/home/runner/work/esl/esl/node_modules/stucumber/dist/cucumber.js:102:16)
    at /home/runner/work/esl/esl/e2e/tests/homepage.feature:24:10
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
```
</td></tr>
<tr><td>Feature: Homepage looks fine:test homepage footer on mobile</td><td>:x:</td><td>2.429s</td></tr>
<tr><td colspan="3">
```text
Error: Image mismatch found: /home/runner/work/esl/esl/e2e/.diff/feature-homepage-looks-fine-test-homepage-footer-on-desktop-diff.webp
    at /home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:36:17
    at Generator.next (<anonymous>)
    at /home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:8:71
    at new Promise (<anonymous>)
    at Object.<anonymous>.__awaiter (/home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:4:12)
    at /home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:33:117
    at Cucumber.convertHandler (/home/runner/work/esl/esl/node_modules/stucumber/src/cucumber.ts:183:11)
    at Cucumber.<anonymous> (/home/runner/work/esl/esl/node_modules/stucumber/src/cucumber.ts:214:30)
    at Generator.next (<anonymous>)
    at /home/runner/work/esl/esl/node_modules/stucumber/dist/cucumber.js:7:71
    at new Promise (<anonymous>)
    at Object.<anonymous>.__awaiter (/home/runner/work/esl/esl/node_modules/stucumber/dist/cucumber.js:3:12)
    at Cucumber.rule (/home/runner/work/esl/esl/node_modules/stucumber/dist/cucumber.js:102:16)
    at /home/runner/work/esl/esl/e2e/tests/homepage.feature:33:10
```
</td></tr>
</table>


