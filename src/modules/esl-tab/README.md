# [ESL](h../../../) Tab & Tab Container

Version: *2.0.0*.

Authors: *Julia Murashko*.

<a name="intro"></a>

ESLTabs is a container component for Tabs trigger group. Uses ESLTab as an item. Each individual ESLTab can control
ESLToggleable or, usually, ESLPanel.

### ESLTabs Attributes / Properties

- `container` - inner element to contain {@link ESLTab} collection. Will be scrolled in a scrollable

- `scrollable` - scrollable mode. Supported types for different breakpoints ('disabled' by default) :
    - 'disabled' or not defined -  scroll behavior is disabled;
    - 'center' - scroll behavior is enabled, tab is center-aligned;
    - 'side' - scroll behavior is enabled, tab is side-aligned;
    - empty or unsupported value - scroll behavior is enabled, tab is side-aligned;

### Events

- `esl:change:active` - thrown when tab changes its state

### Example

```html
<div class="tabs">
  <esl-tabs scrollable>
    <!-- Left arrow -->
    <div class="arrow-prev" data-tab-direction="left"><span class="icon-arrow-prev"></span></div>

    <ul class="esl-tab-container" role="tablist">
      <li>
        <esl-tab target="::parent(.tabs)::find(.tab-1)">Tab #1</esl-tab>
      </li>
      <li class="nav-item">
        <esl-tab target="::parent(.tabs)::find(.tab-1)">Tab #2</esl-tab>
      </li>
      <li class="nav-item">
        <esl-tab target="::parent(.tabs)::find(.tab-1)">Tab #3</esl-tab>
      </li>
    </ul>

    <!-- Right arrow -->
    <div class="arrow-next" data-tab-direction="right"><span class="icon-arrow-next"></span></div>
  </esl-tabs>

  <esl-panel-group mode="tabs">
    <esl-panel class="tab tab-1">
      Content for tab 1
    </esl-panel>
    <esl-panel class="tab tab-2">
      Content for tab 2
    </esl-panel>
    <esl-panel class="tab tab-3">
      Content for tab 3
    </esl-panel>
  </esl-panel-group>
</div>
```
