# ESL Code Styleguide

## Naming convention agreements

### General
- **PascalCase should be used for class names, constructors or, exceptionally, 
  for variables that reference a constructor**
- **Use camelCase for variable and method names**
- **For constants (in case it is a final value) prefer an uppercase SNAKE_CASE convention**

### Special conventions
- `_private` (private notation) - **must use**
  Typical cases: 
  - For inner details that should be hidden from outside world
  - Everything that can corrupt component from outside
  - Listeners (e.g. `_onSomeEvent`), due to potential conflicts with consumer's code
  
- `__private__`(behavioral private notation) - **conditionally** for utilities and core inner details
  Typical cases:
   - For utils private state (can not get or set from outside)
   - For core functionality private state (can not get or set from outside)

- `$domElement`(JQuery notation / HTMLElement notation) - **must use**
  Typical cases:
  - For class variable that stores DOM element
  - For accessor that returns DOM element

- `_$element` (HTMLElement notation + private notation) - **use both**
  Typical cases:
  - For private variable that stores DOM element
  - For private accessor that returns DOM element
  
#### *Notes:*
- **Special conventions are applicable for public or internal API, function arguments and global variables**
- **Special conventions are not applicable for local variables**
- `observable$` (observable notation) - **declined for now** (due to the absence of real cases)

## ES6 Imports/Exports
 - Keep in mind that ESL supports ES6 tree shakable usage
 - Prefer named imports over default definition
