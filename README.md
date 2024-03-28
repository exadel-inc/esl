# Test Results
  ## Summary
  
| :clock10: Start time | :hourglass: Duration |
| --- | ---: |
|3/28/2024, 11:26:21 PM|6.95s|

| | :white_check_mark: Passed | :x: Failed | :construction: Todo | :white_circle: Total |
| --- | ---: | ---: | ---:| ---: |
|Test Suites|1|1|-|2|
|Tests|1|1|0|2|



  ---
  ## Tests Details
  ### tests/test.feature
<table>
<tr><th>Test</th><th>Status</th><th>Time</th></tr>
<tr><td>Feature: Test page looks fine:test page screen</td><td>:x:</td><td>2.317s</td></tr>
<tr><td colspan="3">
```text
Error: New snapshot was not written. The update flag must be explicitly passed to write a new snapshot.

 + This is likely because this test is run in a continuous integration (CI) environment in which snapshots are not written by default.


    at /home/runner/work/esl/esl/e2e/setup/scenarios.screenshot.ts:26:17
    at Cucumber.convertHandler (/home/runner/work/esl/esl/node_modules/stucumber/src/cucumber.ts:183:11)
    at Cucumber.<anonymous> (/home/runner/work/esl/esl/node_modules/stucumber/src/cucumber.ts:214:30)
    at Generator.next (<anonymous>)
    at /home/runner/work/esl/esl/node_modules/stucumber/dist/cucumber.js:7:71
    at new Promise (<anonymous>)
    at Object.<anonymous>.__awaiter (/home/runner/work/esl/esl/node_modules/stucumber/dist/cucumber.js:3:12)
    at Cucumber.rule (/home/runner/work/esl/esl/node_modules/stucumber/dist/cucumber.js:102:16)
    at /home/runner/work/esl/esl/e2e/tests/test.feature:7:10
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
```
</td></tr>
</table>

### tests/homepage.feature
<table>
<tr><th>Test</th><th>Status</th><th>Time</th></tr>
<tr><td>Feature: Homepage looks fine:test homepage screen</td><td>:white_check_mark:</td><td>3.717s</td></tr>
</table>


