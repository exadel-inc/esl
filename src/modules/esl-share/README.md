# [ESL](../../../) Share

Version: *1.0.0-beta*.

Authors: *Dmytro Shovchko*.

***Important Notice: the component is under beta version, it is tested and ready to use but be aware of its potential critical API changes.***

<a name="intro"></a>

The ESL Share component provides the capability of integrating into a web page a sharing mechanism of the page on social media platforms, such as Facebook, Twitter, and Pinterest. The available share actions depend on the device but might include the clipboard, email applications, websites, social media, etc.

`ESLShareButton` is a custom element that is used for displaying the "Share on social media" button. It is intended to share the page using the action specified on the button.

`ESLShare` is a custom element that is used for showing the list of social media buttons. The element's content (a set of `ESLShareButtons`) is created automatically by specifying a list of networks or groups to display. Available social networks and their groups are listed in the configuration file.

### Usage

Make sure you register the share actions that you are going to use on your pages. You don't need to do anything special for this, just import the necessary share actions - the registration will be done automatically.

Next, you have two options for using the share component. The first option is to use only the ESLShareButton. In this case, you simply add this element to the markup and set the required configuration with the attributes. The element needs to be registered with `ESLShareButton.register()`. And that's it.

The second option to use the share component is to define the component configuration and bind it to the ESLShare. After that, all you have to do is to add an element with names or groups of social networks to the ESLShare markup. The item content, consisting of a set of buttons, will be generated automatically. It's the same as you would add each button to the markup and prescribe its configuration manually.

To use this option it is necessary to set the configuration for the list of buttons
```
ESLShare.config(() => fetch('/assets/share/config.json').then((response) => response.json()));
```
and then register the item
`ESLShare.register();`

### ESLShare config

Config is a javascript object that contains two properties. The first one is `buttons` describing the configuration of the buttons. The second is `groups` which configures the groups. Both properties are arrays containing objects describing buttons and groups respectively.

An example of a description of the button configuration:
```
{
    "action": "media",
    "icon": "\u003csvg xmlns\u003d\"http://www.w3.org/2000/svg\" aria-hidden\u003d\"true\" focusable\u003d\"false\" role\u003d\"presentation\" viewBox\u003d\"0 0 27.99 28\"\u003e\u003cpath d\u003d\"M23 17.11l.55-4.24h-4.2v-2.71c0-1.23.34-2.06 2.1-2.06h2.25V4.29a31.62 31.62 0 00-3.28-.16c-3.24 0-5.46 2-5.46 5.61v3.13h-3.63v4.24H15V28h4.39V17.11z\"/\u003e\u003c/svg\u003e",
    "iconBackground": "#3c5996",
    "link": "//www.facebook.com/sharer.php?u\u003d{u}",
    "name": "facebook",
    "title": "Facebook"
}
```
or for example the configuration of the copy button
```
{
    "action": "copy",
    "icon": "\u003csvg xmlns\u003d\"http://www.w3.org/2000/svg\" aria-hidden\u003d\"true\" focusable\u003d\"false\" role\u003d\"presentation\" viewBox\u003d\"0 0 28 28\"\u003e\u003cpath d\u003d\"M17 9.69l-7.43 7.43 1.18 1.18 7.43-7.43L17 9.69z\"/\u003e\u003cpath d\u003d\"M4.31 17.8c-.481.481-.48 1.29.00138 1.77l4.02 4.02c.481.481 1.29.483 1.77.00138l4.95-4.95c.481-.481.481-1.29-7e-7-1.78l-4.02-4.02c-.481-.481-1.29-.481-1.78 0l-4.95 4.95zm1.47.887l4.36-4.36 3.44 3.44-4.36 4.36-3.44-3.44zm7-9.37c-.481.481-.481 1.29 2.8e-7 1.78l4.02 4.02c.481.481 1.29.481 1.78 0l4.95-4.95c.481-.481.48-1.29-.00138-1.77l-4.02-4.02c-.481-.481-1.29-.483-1.77-.00138l-4.95 4.95zm1.47.889l4.36-4.36 3.44 3.44-4.36 4.36-3.44-3.44z\"/\u003e\u003c/svg\u003e",
    "iconBackground": "#a0522d",
    "link": "",
    "name": "copy",
    "title": "Copy",
    "additional": {
        "alertText": "Copied to clipboard"
    }
}
```
What the properties of the button description object mean:
 - `action` - the name of the action to be performed by clicking on the button (recall that the action must be registered, the import was executed)
 - `icon` - the HTML content of the share icon
 - `iconBackground` - the color of the icon background (the value -  CSS data type represents a color). If you do not need to set the color, set the value to `transparent`
 - `link` - URL link (with placeholders) to share on a social network. Can contain the next placeholders:
    - {u} or {url} - URL to share on social network (shareUrl property on the ESLShareButton instance)
    - {t} or {title} - title to share on social network (shareTitle property on the ESLShareButton instance)
 - `name` - string identifier of the button (no spaces)
 - `title` - button title
 - `additional` - additional params to pass into a button (can be used by share actions)

The configuration object of the group is simple, consisting of two properties:
 - `name` - string identifier of the group (no spaces)
 - `list` - list of buttons included in the group

An example of a description of the group configuration:
```
{
    "name": "demo",
    "list": "facebook twitter linkedin wykop copy"
}
```
The group may include another group. So this configuration describing nested groups will be valid:
```
{
    "name": "tier0",
    "list": "copy print"
},
{
    "name": "tier1",
    "list": "twitter linkedin group:tier0"
},
{
    "name": "tier2",
    "list": "facebook group:tier1"
}
```

### Share actions available for use

ESLShare provides several actions available for you to use:
 - `copy` - action for copying to the clipboard. It can use additional params `alertText` (with message text) to show an alert to indicate a successful operation
 - `external` - action for sharing via an external application. It is used to produce actions via external applications linked via schema in URL (for example mailto:, news: or tel: )
 - `media` - action for sharing via a link to share on a social media
 - `native` - action for sharing that invokes the native sharing mechanism of Web Share API
 - `print` - action for printing a page

For using actions you should import the required actions before setting up the configuration and registering ESLShare components. When an unregistered action is specified for a button, the button will not be able to perform the share action and will be marked as 'unavailable'. The same behavior occurs if the action is unavailable on the user's device, e.g. native action on the user's desktop.

### Setting the ESLShare configuration

Before registering an ESLShare item, you must set the component configuration. To do this, use the static `ESLShare.config()` method of the component, which either receives as an argument a config object or a provider function that returns a promise of a config object.

For example:
```
ESLShare.config(() => fetch('/assets/share/config.json').then((response) => response.json()));
```

### ESLShareButton

#### Attributes / Properties

 - `action` - name of share action that occurs after button click
 - `link` - link to share on a social network
 - `name` - social network identifier
 - `share-url` - URL to share (current page URL by default)
 - `share-title` - title to share (current document title by default)
 - `additional` - additional params to pass into a button (can be used by share actions)
 - `unavailable` - marker of availability of share button

#### Attributes cascading

If you need to use URL and title overrides within any parts of the page to share using the `share-url` and `share-title` attributes, you don't need to write these attributes on each button. You can write them once on the root element of the part for which these values are valid. You can do this on the body of the document if you want to override the values for the entire document.

The principle of cascading is similar to CSS variables. The value is searched from the element and up the tree to the document body itself. If the attribute is not found in parent elements, the default value is used.

#### Public API

 - `share` - the same as clicking the button, i.e. perform the share action

### ESLShare

#### Attributes / Properties

 - `list` - list of social networks or groups of them to display (all by default). The value - a string containing the names of the buttons or groups (specified with the prefix group:) separated by spaces. For example: `"facebook reddit group:default"`
 - `share-url` - URL to share (current page URL by default)
 - `share-title` - title to share (current document title by default)
 - `mode` - rendering mode of the share buttons. The `list` and `popup` are available (list by default)
 - `ready` - ready state marker

#### Modes

There are two modes available to render buttons.

In `list` mode, the buttons are drawn inside the component as a list. Nothing special.

When `popup` mode is specified, the buttons are created inside a [ESLPopup](../esl-popup/README.md) element, which is built directly into the document's body. If a [ESLPopup](../esl-popup/README.md) element with the desired set of buttons already exists in the document body, the existing one will be reused. A trigger element is created inside the ESLShare component to activate the popup with share buttons, which will activate the popup when you hover over it. Also, one additional activity of the ESLShareTrigger is to forward the `share-title` and `share-url` attributes from the root ESLShare component to the popup. So it's possible for components with the same set of buttons but different URLs and title to share to use the same popup.

#### Public API

 - `config` - static method to get or update config with a promise of a new config object or using a config provider function
 - `build` - builds content of component

#### Events

 - `esl:share:ready` - event to dispatch on ready state of ESLShare

### ESLShareAction

**ESLShareBaseAction** is an interface that describes share actions. Custom user's actions realizing this interface should have next public methods:
 - `isAvailable` - checks if this action is available on the user's device
 - `share` - performs an action to share
