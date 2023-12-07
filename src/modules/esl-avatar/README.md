# [ESL](../../../) Avatar

Version: *1.0.0-beta*.

Authors: *Dmytro Shovchko*.

***Important Notice: the component is under beta version, it is tested and ready to use but be aware of its potential critical API changes.***

<a name="intro"></a>

**ESLAvatar** is a versatile UI element representing a user with profile pictures or initials.

The component works as follows. If the consumer has specified the `src` attribute with the profile picture URL, the component will try to display the image in the inner content.

If the URL of the picture is not specified or an error occurs when loading the image, the component will switch to text mode. In text mode, it displays the initials from the username or in simple words, just the first letters of each word in the username. The length of this username abbreviation is limited by the `abbr-length` parameter and defaults to 2.

### Attributes:

- `abbr-length` - the limit number of letters to be displayed in text-only mode
- `loading` - policy of loading image that is outside of the viewport
- `src` - URL of the avatar picture
- `username` - the name of the user for whom the avatar is displayed.

### API

- `abbr` - getter that returns an abbreviation to display in text-only mode and for alt property of image
- `init` - initializes inner content of the component.

### Events

 - `esl:avatar:changed` - event to dispatch on change of ESLAvatar
  