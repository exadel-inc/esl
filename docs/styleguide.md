# ESL Code Styleguide

## Naming convention agreements

- `_private` (private notation) - **mast use**
  Typical cases: 
  - For inner details that should be hidden from outside world. 
  - Everything that can corrupt component from the outside
  - Listeners (e.g. `_onSomeEvent`), due to potential conflicts with consumers code
  
- `__private__`(behavioral private notation) - **conditionally** for utilities and core inner details
  Typical cases:
   - For utils private state (can not get or set from the outside)
   - For core functionality private state (can not get or set from the outside)

- `$domElement`(JQuery notation / HTMLElement notation) - **mast use**
  Typical cases:
  - For variable that stores DOM element
  - For accessor that returns DOM element

- `_$element` (HTMLElement notation + private notation) - **use both**
  Typical cases:
  - For private variable that stores DOM element
  - For private accessor that returns DOM element
  
#### *Notes:*
- `observable$` (observable notation) - **declined for now** (due no real cases for now)

## ES6 Imports/Exports
 - keep in mind that ESL support ES6 tree shakable usage
 - prefer named imports over default definition
