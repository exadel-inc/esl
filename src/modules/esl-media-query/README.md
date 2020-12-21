# [ESL](../../../README.md) Media Query Utils

Version: *1.0.0-alpha*

Authors: *Alexey Stsefanovich (ala'n)*, *Yuliya Adamskaya*, *Julia Murashko*

ESL Media Query is an extended browser MediaQueryList object and related utils.
In addition to native Media Features, ESL Media Query allows special *shortcuts* to simplify syntax and query usage.

### Supported ESL Media Query features

- Native [Media Query Features](https://www.w3.org/TR/css3-mediaqueries/#media1)  
  (e.g. `(min-wigth: 300px)`, `(orientation: landscape)`, `(min-wigth: 300px) and (orientation: landscape)`)
- Shortcuts for DPR (Device Pixel Ratio) detection  
  Syntax `@x<dpr_value>` (e.g. `@x1`, `@x2`, `@x1.5`)
- Can block queries with DPR value greater than 1 for PageSpeedBots
- Screen breakpoints shortcuts  
  (e.g. `@XS`, `@md`, `@+LG`, `@-MD`)  
  Supports breakpoints declared in [ESLMediaBreakpoints](#eslmediabreakpoints) registry.   
  Accepts modifiers like `+` for upper breakpoints and `-` for lower breakpoints.
- `@MOBILE` and `@DESKTOP` shortcuts for device detection

---

### ESLMediaBreakpoints

ESLMediaBreakpoints is a custom screen breakpoints registry. 
It allows to define a named screen width range.

Use `ESLMediaBreakpoints.addCustomBreakpoint` static method to change default or define your own Screen Breakpoint.

---

### ESLMediaQuery 

ESLMediaQuery is an extended MediaQueryList wrapper that supports native api and accepts extended ESL Media Query features.

*Note: Use `ESLMediaQuery.ignoreBotsDpr` marker to enable DPR ignoring for PageSpeed Bots*

--- 

### ESLMediaRule

Pair of ESLMediaQuery and payload value. 
ESLMediaRule is used as an item for [ESLMediaRuleList](#eslmediarulelist).  
ESLMediaRule can be parsed from `<ESL Media Query> => <value>` syntax string, 
e.g. `@XS => 1` (`1` is a payload) or `@+LG and @DESKTOP => desktop` (`'desktop'` is a payload)

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
