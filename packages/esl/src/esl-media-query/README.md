# [ESL](../../../) Media Query Utils

Version: *4.0.0*

Authors: *Alexey Stsefanovich (ala'n)*, *Yuliya Adamskaya*, *Julia Murashko*

<a name="intro"></a>

**ESLMediaQuery** is an extended browser `MediaQueryList` object and related utils such as rule-value pairs 
called `ESLMediaRuleList`.

In addition to native Media Features, `ESLMediaQuery` allows special *shortcuts* to simplify syntax and query usage.
`ESLMediaQuery` is more tolerant to logical operations and allows using of multiple 'not' operators or 
having extra conditions inside the query (`all and all` still a valid condition).
`ESLMediaRuleList` allows to map condition defined by `ESLMediaQuery` to the value, 
it is serializable and supports multiple formats to parse.  
Both `ESLMediaQuery` and `ESLMediaRuleList` implements `EventTarget` interface, 
so they're compatible to use with DOM EventListeners, including `ESLEventListener` feature.

<a name="features"></a>
### Supported ESL Media Query features

- Native [Media Query Features](https://www.w3.org/TR/css3-mediaqueries/#media1)  
  (e.g. `(min-wigth: 300px)`, `(orientation: landscape)`, `(min-wigth: 300px) and (orientation: landscape)`).
- Shortcuts for DPR (Device Pixel Ratio) detection.  
  Syntax `@x<dpr_value>` (e.g. `@x1`, `@x2`, `@x1.5`).
- Can block queries with DPR value greater than 1 for PageSpeedBots.
- Screen breakpoints shortcuts (e.g. `@XS`, `@md`, `@+LG`, `@-MD`)  
  Supports breakpoints declared in [ESLScreenBreakpoints](#breakpoints) registry.
  Accepts modifiers like `+` for upper breakpoints and `-` for lower breakpoints.
- Device and browser detection shortcuts that are registered through [ESLEnvShortcuts](#shortcuts) registry (e.g. `@BOT`, `@SAFARI`, `@IOS`).
- `or` operation alias in addition to "`,`" (`@xs or @mobile` is the same as `@xs, @mobile`)
- Multiple `not` operators, that is not sensitive to position
  (e.g. `not @ie`, `not @xs and not @mobile`)
- Implements `EventTarget` interface and compatible with `ESLEventListener`.  
**Note**: `ESLMediaQuery` ignores event name passed to `EventTarget` interface methods

---

<a name="media-query"></a>
### ESLMediaQuery API

`ESLMediaQuery` is a central API to create an extended Media Query conditions.

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
  - `MediaQueryConjunction` - group of conditions unified by `and` operator
  - `MediaQueryDisjunction` - group of conditions unified by `or` operator
  - `MediaQueryNegation` - condition with `not` operator
  - `MediaQueryShortcut` - wrapper around `ESLMediaShortcuts` registry shortcuts (these conditions considered as dynamic to ensure user can replace them at runtime).

The `ESLMediaQuery`(`IMediaQueryConditionInterface`) instances provide the following set of properties and methods:
  - `matches` - returns `true` if the current environment configuration is acceptable for current query condition
  - `optimize` - inner method to rebuild condition tree, and provide static and logic expression optimization.

Event Target methods:
- `ESLMediaQuery.prototype.addEventListener(cb: EventListener)` or
  `ESLMediaQuery.prototype.addEventListener('change', cb: EventListener)` - subscribes to condition state changes
- `ESLMediaQuery.prototype.removeEventListener(cb: EventListener)` or
  `ESLMediaQuery.prototype.removeEventListener('change', cb: EventListener)` - unsubscribes from condition state changes

As the `ESLMediaQuery` implements `EventListenr` interface, you can use it in the following way:
```ts
class Test {
  @listen({ event: 'change', target: ESlMediaQuery.for('@-sm') })
  protected onQueryMatch(e: ESLMediaChangeEvent) {
    // ...
  }
}
```

The incoming JavaScript event will be an instance of [ESLMediaChangeEvent](#media-change-event).

---

<a name="breakpoints"></a>
### ESLScreenBreakpoints

`ESLScreenBreakpoints` is a custom screen breakpoints registry. It allows defining a named screen width range.

Use `ESLScreenBreakpoints.add` static method to change default or define your own Screen Breakpoint.

You can also use `ESLScreenBreakpoints.remove` to exclude breakpoint shortcut from registry.

You can get all available screen breakpoints using the `ESLScreenBreakpoints.names` property or access the complete breakpoint definitions with the `ESLScreenBreakpoints.get` method, which will return an `ESLScreenBreakpoint` instance if it exists.

The list of predefined breakpoints is the following:
  - `@xs` from 1 to 767 pixels
  - `@sm` from 768 to 991 pixels
  - `@md` from 992 to 1199 pixels
  - `@lg` from 1200 to 1599 pixels
  - `@xl` from 1600 to 999999 pixels

---
<a name="dpr"></a>
### ESLScreenDPR

Additional preprocessor to provide DPR shortcuts.

#### ESLScreenDPR API
  - `toDPI` - converts to DPI (Dots Per Inch) based on a given number value
  - `process` - creates a string representation of the DPI value, in the format of (e.g. `(min-resolution: {value}dpi)`)

---

<a name="shortcuts"></a>
### ESLMediaShortcuts <i class="badge badge-sup badge-success">new</i>

`ESLMediaShortcuts`(previously `ESLEnvShortcuts`) is a registry for shortcuts to describe any static/dynamic related conditions that can be used inside `ESLMediaQuery` conditions.

A shortcut can be added to the registry through `ESLMediaShortcuts.set` method
`ESLMediaShortcuts` allows adding boolean result that will be converted to `all` / `not all` query condition or setup result as native MediaQuery string.

`ESLMediaShortcuts` supports dynamic shortcut updates.
Note: shortcut name cannot contain spaces, starts with a digit (after `@` symbol) or contain any special characters except for `-` and `_`.

The list of predefined environment shortcuts is the following:
  - `@MOBILE` - detects mobile devices 
  - `@DESKTOP` - detects desktops

  - `@ANDROID` - detects Android devices
  - `@IOS` - detects iOS devices  
  - `@TOUCH` - cross-browser touch support detection
  - `@EDGE` - detects legacy Edge browser (<18) based on EdgeHTML engine
  - `@GECKO` - detects Gecko engine based browsers (e.g. Firefox)
  - `@BLINK` - detects Blink engine based browsers (e.g. Google Chrome, Opera)
  - `@SAFARI` - detects safari browsers
  - `@SAFARI-IOS` - detects mobile safari browsers

Note: `ESLMediaShortcuts` is a singleton for the window object.
Note: `ESLMediaShortcuts` considered as a last processor in the `ESLMediaQuery` processing chain.

---

<a name="media-rule"></a>
### ESLMediaRule

Pair of `ESLMediaQuery` and value (payload) associated with a query condition. 
`ESLMediaRule` is used as an item for [ESLMediaRuleList](#media-rule-list).  
`ESLMediaRule` can be parsed from `<ESL Media Query> => <value>` syntax string, 
e.g. `@XS => 1` (`1` is the payload) or `@+LG and @DESKTOP => desktop` (`'desktop'` is the payload).

#### ESLMediaRule API
- `ESLMediaRule.prototype.create(payload, query, parser)` - creates an `ESLMediaRule` instance from a payload string, media query, and a payload parser function. If the payload parsing result is undefined, the rule will also be undefined
- `ESLMediaRule.prototype.parse` - parses media rule defined with syntax, where query and value separated by `=>`
- `ESLMediaRule.prototype.all(payload)` - creates an always active `ESLMediaRule` with passed value
- `ESLMediaRule.prototype.empty` - creates an always inactive `ESLMediaRule`

- `toString` - creates a string representation of the media rule, in the format of (e.g. `{media query} => {payload}`)
- `matches` - returns `true` if the inner `ESLMediaQuery` meets the current device configuration

Event Target methods:
- `ESLMediaRuleList.prototype.addEventListener(cb: EventListener)` or
`ESLMediaRuleList.prototype.addEventListener('change', cb: EventListener)` - subscribes to `ESLMediaRule` object value changes 
- `ESLMediaRuleList.prototype.removeEventListener(cb: EventListener)` or
`ESLMediaRuleList.prototype.removeEventListener('change', cb: EventListener)` - unsubscribes from `ESLMediaRule` object value changes 

--- 

<a name="media-rule-list"></a>
### ESLMediaRuleList

ESLMediaRuleList is an observable [ESLMediaRule](#media-rule) collection.
ESLMediaRuleList has methods to work with the whole rules list. 
It implements `EventTarget` interface and compatible with `ESLEventListener`s, 
so you can observe active value changes.

ESLMediaRuleList can be parsed from `<default_value> | <ESL Media Rule> | <ESL Media Rule>` string or 
can be defined with a tuple of corteges with a queries and values.

ESLMediaRuleList should be generalized with the result value type and according payload parser.
- `ESLMediaRuleList.STRING_PARSER` - out of the box string payload parser (you can use String constructor instead).
- `ESLMediaRuleList.OBJECT_PARSER` - out of the box object payload parser (uses evaluation).

Rule defined without query part will match any (`all`) environment.
Queries Examples:
- ` 1 | @XS => 2` - the RuleList result depends on environment and equals `'1'` on all screen breakpoints except XS, 
  on XS it changes to `'2'`.  

- ` @XS => {option: 1} | @+SM => {option: 2}` - the RuleList result depends on environment and equals `{option: 1}` 
  on XS breakpoint, and equals `{option: 2}` on SM and upper breakpoints.

If multiple rule queries satisfied, then the result `ESLMediaRuleList` value pill be computed 
as merged value of all active rules.
For primitive types of payload that means that the last active rule wins.
For objects deep merge result will be used as a result.
See `deepMerge` ESLUtils method for merge details. 
`ESLMediaRuleList` use it independently of payload type.


Parsing queries examples:
```typescript
// Basic parsing
ESLMediaRuleList.parse('1 | @XS => 2'); // first query from the sample above
ESLMediaRuleList.parse('1 | @XS => 2', String); // the same as sample above
ESLMediaRuleList.parse('1 | @XS => 2', Number); // first query from the sample above that store numeric values
ESLMediaRuleList.parse('@XS => {option: 1} | @+SM => {option: 2}', ESLMediaRuleList.OBJECT_PARSER); // second query from the sample above with an object payloads
ESLMediaRuleList.parse('@XS => {option: 1} | @+SM => {option: 2}', evaluate); // the same as the sample above 
ESLMediaRuleList.parse('1|2|3|4|5', '@xs|@sm|@md|@lg|@xl') // parses tuple payloads
ESLMediaRuleList.parse('@mqAlt1 => value1| @mqAlt2 => value2', '@mq1|@mq2'); // parses first argument as an arrow syntax without default tuple consideration.

// Tupple parsing
ESLMediaRuleList.parseTuple('@xs|@sm|@md|@lg|@xl', '1|2|3|4|5') // String payload example
ESLMediaRuleList.parseTuple('@xs|@sm|@md|@lg|@xl', '1|2|3|4|5',  Number) // Numeric payload sample
```

#### ESLMediaRuleList API

- `ESLMediaRuleList.parseTuple(queries: string, values: string)` - parse media ruleset from tuple of queries and values, all separated via `|` symbol.

- `ESLMediaRuleList.parseQuery(ruleset: string)` - parse media ruleset defined with syntax, where query and value are a single argument separated by `=>` for each rule.

- `ESLMediaRuleList.parse(values: string, queries: string)` - parse media ruleset adaptively. Method can support both notations with a ruleset from tuple of queries and values, all separated via `|` symbol, and can parse cases where query syntax with rules separated by `=>` is being used as a value for a tuple.

- `ESLMediaRuleList.prototype.rules` - array of rules that defines `ESLMediaRuleList` object
- `ESLMediaRuleList.prototype.active` - array of active (matched) rules 
- `ESLMediaRuleList.prototype.activeValue` - payload of the last of active rules or `undefined` 
- `ESLMediaRuleList.prototype.activeValues` - array of active rules payloads
- `ESLMediaRuleList.prototype.value` - active (merged) value of `ESLMediaRuleList` object
- `ESLMediaRuleList.prototype.computedValue` - always computed (non-cached) merged active value

Event Target methods:
- `ESLMediaRuleList.prototype.addEventListener(cb: EventListener)` or
`ESLMediaRuleList.prototype.addEventListener('change', cb: EventListener)` - subscribes to `ESLMediaRuleList` object value changes 
- `ESLMediaRuleList.prototype.removeEventListener(cb: EventListener)` or
`ESLMediaRuleList.prototype.removeEventListener('change', cb: EventListener)` - unsubscribes from `ESLMediaRuleList` object value changes 

The incoming JavaScript event will be an instance of [ESLMediaRuleListEvent](#media-rule-event).

---
### ESLMediaQuery events
<a name="media-rule-event"></a>
#### ESLMediaRuleListEvent

`ESLMediaRuleListEvent` is a custom event dispatched by `ESLMediaRuleList` instances.

`ESLMediaRuleListEvent` properties:
  - `current` - current value of target `ESLMediaRuleList` instance
  - `previous` - previous value of target `ESLMediaRuleList` instance
  - `target` - target `ESLMediaRuleList` instance

<a name="media-change-event"></a>
#### ESLMediaChangeEvent

`ESLMediaChangeEvent` is a custom event dispatched by `ESLMediaQuery` instances.

`ESLMediaChangeEvent` properties:
  - `public` - boolean value that indicates whether the query matched the device conditions when the event was dispatched
  - `media`- getter that returns serialized value of the current `ESLMediaQuery`
  - `target`- matched `MediaQueryCondition`
