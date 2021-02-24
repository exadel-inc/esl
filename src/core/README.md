# UIP Root

UIPRoot - state storage.

---

### Notes: 

- **Root** stores the *state*, which is an actual markup of the current component.
- Listens for '*request:change*' event that transfers state changes from UIP components to **Root**
- Dispatches '*state:change*' event that delivers state changes to other UIP components
---

### Example:

```html
<uip-root></uip-root>
```

```typescript
const root = document.querySelector('uip-root');
root.addEventListener('state:change', callback);
```
