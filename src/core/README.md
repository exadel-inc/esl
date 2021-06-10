# UIP Plugin

[UIPPlugin](README.md) - base class for UIP elements which implements uip components connection logic.

---

### Notes:

- Has *dispatchChange()* method for dispatching markup changes.
- Contains *handleChange()* method which triggers when markup changes reach the element.
- Includes *label* attribute for adding label to the element. Examples can be seen within other basic UIP components
---

### Example:

```typescript
import {UIPPlugin} from "./plugin";

class MyUIPComnonent extends UIPPlugin {
    protected handleChange(): void {
        //Your logic here...
    }
}
```
