Feature: Test page looks fine
  Scenario: test page screen
    Given a page "/test/test-page"
    When on desktop
    Then wait for 2s
    And take a screenshot of a full page
    Then check if the screenshot is equal to the snapshoted version
