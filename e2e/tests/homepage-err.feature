Feature: Homepage temporary error case
  Scenario: test homepage screen when it is not ready
    Given a page "/"
    When on desktop
    Then wait for 0.5s
    And take a screenshot of a full page
    Then check if the screenshot is equal to the snapshoted version
