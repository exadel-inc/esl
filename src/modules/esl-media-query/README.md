# [ESL](../../../README.md) Media Query Utils

Version: *2.0.0*

Authors: *Alexey Stsefanovich (ala'n)*, *Yuliya Adamskaya*, *Julia Murashko*

ESL Media Query is an extended browser MediaQueryList object and related utils.
In addition to native Media Features, ESL Media Query allows special *shortcuts* to simplify syntax and query usage.
ESLMediaQuery is more tolerant to logical operations and allows using of multiple 'not' operators or 
having extra conditions inside the query (`all and all` still a valid condition).

### Supported ESL Media Query features

- Native [Media Query Features](https://www.w3.org/TR/css3-mediaqueries/#media1)  
  (e.g. `(min-wigth: 300px)`, `(orientation: landscape)`, `(min-wigth: 300px) and (orientation: landscape)`).
- Shortcuts for DPR (Device Pixel Ratio) detection  
  Syntax `@x<dpr_value>` (e.g. `@x1`, `@x2`, `@x1.5`).
- Can block queries with DPR value greater than 1 for PageSpeedBots.
- Screen breakpoints shortcuts (e.g. `@XS`, `@md`, `@+LG`, `@-MD`)  
  Supports breakpoints declared in [ESLScreenBreakpoints](#eslscreenbreakpoints) registry.   
  Accepts modifiers like `+` for upper breakpoints and `-` for lower breakpoints.
- Device and browser detection shortcuts that are registered through [ESLEnvShortcuts](#eslenvshortcuts) registry.
  The list of predefined environment shortcuts is the following:
  - `@BOT` - detects search/pagespeed bots
  - `@MOBILE` - detects mobile devices 
  - `@DESKTOP` - detects desktops
  - `@ANDROID` - detects Android devices
  - `@IOS` - detects iOS devices  
  - `@TOUCH` - cross-browser touch support detection
  - `@IE` - detects InternetExplorer 11
  - `@EDGE` - detects legacy Edge browser (<18) based on EdgeHTML engine
  - `@GECKO` - detects Gecko engine based browsers (e.g. Firefox)
  - `@BLINK` - detects Blink engine based browsers (e.g. Google Chrome, Opera)
  - `@SAFARI` - detects safari browsers
  - `@SAFARI-IOS` - detects mobile safari browsers  
- `or` operation alias in addition to `,` (`@xs or @mobile` is the same as `@xs, @mobile`)
- Multiple `not` operators, that is not sensitive to position
  (e.g. `not @ie`, `not @xs and not @mobile`)
---

### ESLScreenBreakpoints

ESLScreenBreakpoints is a custom screen breakpoints registry. It allows defining a named screen width range.

Use `ESLScreenBreakpoints.add` static method to change default or define your own Screen Breakpoint.

You can also use `ESLScreenBreakpoints.remove` to exclude breakpoint shortcut from registry.

You can get all available screen breakpoints through `ESLScreenBreakpoints.names` property or access full breakpoint 
definition trough `ESLScreenBreakpoints.get`.

---

### ESLScreenDPR

Additional preprocessor to provide DPR shortcuts.

Use `ESLScreenDPR.ignoreBotsDpr` marker to enable DPR ignoring for PageSpeed Bots.

---

### ESLEnvShortcuts

ESLEnvShortcuts is a simple registry for a static shortcuts to describe environment related conditions

An additional shortcuts can be added to the registry through `ESLEnvShortcuts.add` method
ESLEnvShortcuts allows adding boolean result that will be converted to `all` / `not all` query conditions or setup result as native MediaQuery string. 

Environment shortcuts can be removed with `ESLEnvShortcuts.remove` method.

---

### ESLMediaQuery 

ESLMediaQuery is a central API to create an extended Media Query conditions.

 - Use `ESLMediaQuery.for('query')` to create ESLMediaQuery condition.  
   Note: method `ESLMediaQuery.for` is memoized so multiple calls with the same query will return the same query 
   instance as the result, which also means you might not need store or optimize ESLMediaQuery.for calls from your side.
   
 - Use `ESLMediaQuery.from('query')` to create new ESLMediaQuery condition instance. 
   Not memoized in opposite to `ESLMediaQuery.for`;

 - Use `ESLMediaQuery.use` to register custom query preprocessor. 
   Note: `ESLScreenBreakpoints`, `ESLScreenDPR`, `ESLEnvShortcuts` are three preprocessors that are registered by default.
   
Note: ESLMediaQuery has no real instances and represents `IMediaQueryConditionInterface` interface.
`IMediaQueryConditionInterface` is implemented by 4 types of inner conditions:
  - `MediaQueryConstCondition` with only two possible instances `ALL` and `NOT_ALL`
  - `MediaQueryCondition` - simple wrapper around native MediaQueryList object
  - `MediaQueryConjunction` - `and` condition container
  - `MediaQueryDisjunction` - `or' condition container

The `ESLMediaQuery`(`IMediaQueryConditionInterface`) instances provide the following set of properties and methods:
  - `matches` - boolean getter that returns if the current environment configuration is acceptable for current query condition
  - `addListener(cb)` - to subscribe on condition state changes
  - `removeListener(cb)` - to unsubscribe from condition state changes
  - `optimize` - inner method to rebuild condition tree, and provide static and logic expression optimization.

---

### ESLMediaRule

Pair of ESLMediaQuery and payload value. 
ESLMediaRule is used as an item for [ESLMediaRuleList](#eslmediarulelist).  
ESLMediaRule can be parsed from `<ESL Media Query> => <value>` syntax string, 
e.g. `@XS => 1` (`1` is a payload) or `@+LG and @DESKTOP => desktop` (`'desktop'` is a payload).

--- 

### ESLMediaRuleList

ESLMediaRuleList is a [ESLMediaRule](#eslmediarule) collection.
ESLMediaRuleList has methods to work with the whole rules list. 
It implements an observable interface, so you can observe active value changes.

ESLMediaRuleList can be parsed from `<default_value> | <ESL Media Rule> | <ESL Media Rule>` string.

ESLMediaRuleList should be generalized with the result value type and according payload parser.
- `ESLMediaRuleList.STRING_PARSER` - out of the box string payload parser.
- `ESLMediaRuleList.OBJECT_PARSER` - out of the box object payload parser (uses evaluation).

Examples:
- ` 1 | @XS => 2` - the RuleList result depends on environment and equals '1' on all screen breakpoints except XS, 
  on XS it changes to '2'.  

- ` @XS => {option: 1} | @+SM => {option: 2}` - the RuleList result depends on environment and equals `{option: 1}` 
  on XS breakpoint, and equals `{option: 2}` on SM and upper breakpoints.
