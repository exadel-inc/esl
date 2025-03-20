# Test Results
  ## Summary
  
| :clock10: Start time | :hourglass: Duration |
| --- | ---: |
|3/20/2025, 4:30:53 PM|19.99s|

| | :white_check_mark: Passed | :x: Failed | :construction: Todo | :white_circle: Total |
| --- | ---: | ---: | ---:| ---: |
|Test Suites|2|1|-|3|
|Tests|7|1|0|8|



  ---
  ## Tests Details
  ### tests/homepage.copyright.test.ts
<table>
<tr><th>Test</th><th>Status</th><th>Time</th></tr>
<tr><td>Homepage footer manual validation: Check if the footer copyright contains correct version</td><td>:x:</td><td>31ms</td></tr>
<tr><td colspan="3">
```text
Error: expect(received).toContain(expected) // indexOf

Expected substring: "5.1.0"
Received string:    "
        ESL v5.2.0-local © 2025 Exadel, Inc.
        Code licensed under MIT.
        Privacy
      "
    at /home/runner/work/esl/esl/packages/snapshot-tests/tests/homepage.copyright.test.ts:12:21
    at Generator.next (<anonymous>)
    at fulfilled (/home/runner/work/esl/esl/packages/snapshot-tests/tests/homepage.copyright.test.ts:38:58)
```
</td></tr>
<tr><td>Homepage footer manual validation: Check if the footer coypright contains correct year</td><td>:white_check_mark:</td><td>4ms</td></tr>
</table>

### tests/test.feature
<table>
<tr><th>Test</th><th>Status</th><th>Time</th></tr>
<tr><td>Feature: Test page looks fine: test page screen</td><td>:white_check_mark:</td><td>3.21s</td></tr>
</table>

### tests/homepage.feature
<table>
<tr><th>Test</th><th>Status</th><th>Time</th></tr>
<tr><td>Feature: Homepage looks fine: test homepage screen</td><td>:white_check_mark:</td><td>3.578s</td></tr>
<tr><td>Feature: Homepage looks fine: test homepage screen on mobile</td><td>:white_check_mark:</td><td>2.848s</td></tr>
<tr><td>Feature: Homepage looks fine: test homepage hamburger menu on mobile</td><td>:white_check_mark:</td><td>3.327s</td></tr>
<tr><td>Feature: Homepage looks fine: test homepage footer on desktop</td><td>:white_check_mark:</td><td>2.65s</td></tr>
<tr><td>Feature: Homepage looks fine: test homepage footer on mobile</td><td>:white_check_mark:</td><td>2.267s</td></tr>
</table>


