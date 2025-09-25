


<h1>Test Results</h1>
<h2>Summary</h2>
<table>
  <tbody>
    <tr><td>🕙 Start time</td><td>⌛ Duration</td></tr>
    <tr><td>9/25/2025, 8:58:43 AM</td><td>21.68s</td></tr>
  </tbody>
</table>
<table>
  <tbody>
    <tr><td></td><td>✅ Passed</td><td>❌ Failed</td><td>🚧 Todo</td><td>⚪ Total</td></tr>
    <tr><td>Test Suites</td><td>1</td><td>2</td><td>-</td><td>3</td></tr>
    <tr><td>Tests</td><td>5</td><td>3</td><td>0</td><td>8</td></tr>
  </tbody>
</table><hr/>
<h2>Tests Details</h2><h3>tests/homepage.copyright.test.ts</h3>
<table>
  <tbody>
    <tr><td>Test</td><td>Status</td><td>Time</td></tr><tr><td>Homepage footer manual validation: Check if the footer copyright contains correct version</td><td>✅</td><td>59ms</td></tr><tr><td>Homepage footer manual validation: Check if the footer coypright contains correct year</td><td>❌</td><td>6ms</td></tr><tr>
    <td colspan="3"><pre>Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoContain[2m([22m[32mexpected[39m[2m) // indexOf[22m

Expected substring: [32m&quot;bla-bla&quot;[39m
Received string:    [31m&quot;[39m
[31m        ESL v5.13.0-local © 2025 Exadel, Inc.[39m
[31m        Code licensed under MIT.[39m
[31m        Privacy[39m
[31m      &quot;[39m
    at /home/runner/work/esl/esl/packages/snapshot-tests/tests/homepage.copyright.test.ts:20:21
    at Generator.next (&lt;anonymous&gt;)
    at fulfilled (/home/runner/work/esl/esl/packages/snapshot-tests/tests/homepage.copyright.test.ts:4:58)</pre></td>
  </tr></tbody>
</table><h3>tests/test.feature</h3>
<table>
  <tbody>
    <tr><td>Test</td><td>Status</td><td>Time</td></tr><tr><td>Feature: Test page looks fine: test page screen</td><td>✅</td><td>3.183s</td></tr></tbody>
</table><h3>tests/homepage.feature</h3>
<table>
  <tbody>
    <tr><td>Test</td><td>Status</td><td>Time</td></tr><tr><td>Feature: Homepage looks fine: test homepage screen</td><td>❌</td><td>4.472s</td></tr><tr>
    <td colspan="3"><img src="" alt="Test Diff feature-homepage-looks-fine-test-homepage-screen-diff.jpg"/></td>
  </tr><tr><td>Feature: Homepage looks fine: test homepage screen on mobile</td><td>❌</td><td>3.208s</td></tr><tr>
    <td colspan="3"><img src="" alt="Test Diff feature-homepage-looks-fine-test-homepage-screen-on-mobile-diff.jpg"/></td>
  </tr><tr><td>Feature: Homepage looks fine: test homepage hamburger menu on mobile</td><td>✅</td><td>3.333s</td></tr><tr><td>Feature: Homepage looks fine: test homepage footer on desktop</td><td>✅</td><td>2.619s</td></tr><tr><td>Feature: Homepage looks fine: test homepage footer on mobile</td><td>✅</td><td>2.292s</td></tr></tbody>
</table>