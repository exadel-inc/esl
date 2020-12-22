# [ESL](../../../README.md) Base Element

Version: *1.0.0-alpha*

Authors: *Alexey Stsefanovich (ala'n)*

Provides the ESLBaseElement - base class for custom element declaration, and a set of common decorators.

### Available decorators:
 - `@attr` - to map string type property to HTML attribute.
 - `@boolAttr` - to map boolean property to HTML boolean (marker) attribute state.
 - `@jsonAttr` - to map object property to HTML attribute using JSON format to serialize / deserialize value.
