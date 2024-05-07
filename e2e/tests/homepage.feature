Feature: Homepage looks fine
  Scenario: test homepage screen
    Given a page "/"
    When on desktop
    Then wait for 2s
    And take a screenshot of a full page
    Then check if the screenshot is equal to the snapshoted version

  Scenario: test homepage screen on mobile
    Given a page "/"
    When on mobile
    Then wait for 2.5s
    And take a screenshot of a full page
    Then check if the screenshot is equal to the snapshoted version

  Scenario: test homepage hamburger menu on mobile
    Given a page "/"
    When on mobile
    Then wait for 2s
    Then find the element by selector ".header-hamburger"
    And click element
    Then wait for 1s
    And take a screenshot of a full page
    Then check if the screenshot is equal to the snapshoted version

  Scenario: test homepage footer on desktop
    Given a page "/"
    When on desktop
    Then wait for 2s
    Then find the element by selector "footer"
    Then check if the element is present
    And take a screenshot of the element
    Then check if the screenshot is equal to the snapshoted version

  Scenario: test homepage footer on mobile
    Given a page "/"
    When on mobile
    Then wait for 2s
    Then find the element by selector "footer"
    Then check if the element is present
    And take a screenshot of the element
    Then check if the screenshot is equal to the snapshoted version
