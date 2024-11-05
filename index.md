# Test Results
  ## Summary
  
| :clock10: Start time | :hourglass: Duration |
| --- | ---: |
|11/5/2024, 9:31:47 AM|20.00s|

| | :white_check_mark: Passed | :x: Failed | :construction: Todo | :white_circle: Total |
| --- | ---: | ---: | ---:| ---: |
|Test Suites|2|1|-|3|
|Tests|4|4|0|8|



  ---
  ## Tests Details
  ### tests/homepage.copyright.test.ts
<table>
<tr><th>Test</th><th>Status</th><th>Time</th></tr>
<tr><td>Homepage footer manual validation: Check if the footer copyright contains correct version</td><td>:white_check_mark:</td><td>55ms</td></tr>
<tr><td>Homepage footer manual validation: Check if the footer coypright contains correct year</td><td>:white_check_mark:</td><td>4ms</td></tr>
</table>

### tests/test.feature
<table>
<tr><th>Test</th><th>Status</th><th>Time</th></tr>
<tr><td>Feature: Test page looks fine: test page screen</td><td>:white_check_mark:</td><td>2.571s</td></tr>
</table>

### tests/homepage.feature
<table>
<tr><th>Test</th><th>Status</th><th>Time</th></tr>
<tr><td>Feature: Homepage looks fine: test homepage screen</td><td>:white_check_mark:</td><td>3.473s</td></tr>
<tr><td>Feature: Homepage looks fine: test homepage screen on mobile</td><td>:x:</td><td>3.007s</td></tr>
<tr><td colspan="3"><img src="https://github.com/exadel-inc/esl/blob/diff-report/homepage.feature/feature-homepage-looks-fine-test-homepage-screen-on-mobile-diff.jpg?raw=true" alt="Test Diff feature-homepage-looks-fine-test-homepage-screen-on-mobile-diff.jpg"/></td></tr><tr><td>Feature: Homepage looks fine: test homepage hamburger menu on mobile</td><td>:x:</td><td>3.471s</td></tr>
<tr><td colspan="3"><img src="https://github.com/exadel-inc/esl/blob/diff-report/homepage.feature/feature-homepage-looks-fine-test-homepage-hamburger-menu-on-mobile-diff.jpg?raw=true" alt="Test Diff feature-homepage-looks-fine-test-homepage-hamburger-menu-on-mobile-diff.jpg"/></td></tr><tr><td>Feature: Homepage looks fine: test homepage footer on desktop</td><td>:x:</td><td>2.926s</td></tr>
<tr><td colspan="3"><img src="https://github.com/exadel-inc/esl/blob/diff-report/homepage.feature/feature-homepage-looks-fine-test-homepage-footer-on-desktop-diff.jpg?raw=true" alt="Test Diff feature-homepage-looks-fine-test-homepage-footer-on-desktop-diff.jpg"/></td></tr><tr><td>Feature: Homepage looks fine: test homepage footer on mobile</td><td>:x:</td><td>2.203s</td></tr>
<tr><td colspan="3">
```text
Error: Error comparing snapshot to image /home/runner/work/esl/esl/e2e/tests/__image_snapshots__/homepage.feature/feature-homepage-looks-fine-test-homepage-footer-on-mobile.jpg
    at /home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:36:23
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
    at /home/runner/work/esl/esl/e2e/tests/homepage.feature:42:10
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
```
</td></tr>
</table>


