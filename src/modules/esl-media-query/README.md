!! Draft !!

# ESL Media Query Utils

ESL Media Query Utils is an extended browser MediaQueryList JS utils.
In addition to native Media Query features ESL Media Query allows special shortcuts to simplify syntax and query usage.

### Supported ESL Media Query features

- Native Media Query Features  
  (e.g. `(min-wigth: 300px)`, `(orientation: landscape)`, `(min-wigth: 300px) and (orientation: landscape)`)  
  See the Media Query Feature list in the [spec](https://drafts.csswg.org/mediaqueries-3/#media0). 
- Shortcuts for DPR detection  
  (e.g. `@x1`, `@x2`, `@x1.5`)  
  Syntax `@x<dpr_value>`
- Can disallow queries for queries with dpr > 1 for page speed bots
- Screen breakpoints shortcuts  
  (e.g. `@XS`, `@md`, `@+LG`, `@-MD`)  
  Supports breakpoints declared in ESLMediaBreakpoints registry. 
  Accepts modifiers like `+` to accept upper breakpoints and `-` to accept lover breakpoints.
- `@MOBILE` and `@DESKTOP` shortcuts for device detection
---

Util contains the following utils:
- ESLMediaBreakpoints
- ESLMediaQuery
- ESLMediaRule
- ESLMediaRuleList

---
### ESLMediaBreakpoints
Custom screen breakpoints registry. Allows to define a named screen width range.

To change default or define you own Screen Breakpoint use `ESLMediaBreakpoints.addCustomBreakpoint` static method.

---
### ESLMediaQuery 
Extended MediaQueryList wrapper supports native api 
with accepting extending Media Query features.

--- 
### ESLMediaRule
Pair of ESLMediaQuery with payload value.
Deserializable from `<ESL Media Query> => <value>` syntax, e.g. `@XS => 1`

--- 
### ESLMediaRuleList
Special mapper collection that maps ESLMediaQueries to values. Observable.
Can be serialized from `<default_value> | <ESL Media Rule> | <ESL Media Rule>`

Example:
` 1 | @XS => 2` means that the RuleList result depends on environment and equal '1' on all screen breakpoints except XS, on XS it changes to '2'  
` @XS => {option: 1} | @+SM => {option: 2}` means that the RuleList result depends on environment and equal `{option: 1}` on XS breakpoint, and equal `{option: 2}` on SM and upper breakpoints
