Feature: Homepage looks fine
  Scenario: test homepage screen
    Given a page "/"
    When on desktop
    Then wait for 2s
    And take a screenshot of a full page
    Then check if the screenshot is equal to the snapshoted version
