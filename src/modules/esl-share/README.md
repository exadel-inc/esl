# [ESL](../../../) Share

Version: *1.0.0-beta*.

Authors: *Dmytro Shovchko*.

***Important Notice: the component is under beta version, it is tested and ready to use but be aware of its potential critical API changes.***

<a name="intro"></a>

The ESL Share component provides the capability of integrating into a web page a sharing mechanism of the page on social media platforms, such as Facebook, Twitter, and Pinterest. The available share actions depend on the device but might include the clipboard, email applications, websites, social media, etc.

**ESLShareButton** is a custom element that is used to show the "Share on social media" button. It is intended to share the page using the action specified on the button.

**ESLShareList** is a custom element that is used to show the list of social media buttons. The content of the element (set of ESLShareButtons) is created automatically by specifying a list of networks or groups to display. Available social networks and their groups are listed in the configuration file.

### Usage

Make sure you register the share actions that you are going to use on your pages. You don't need to do anything special for this, just import the necessary share actions - the registration will be done automatically.

Next, you have two options for using the share component. The first option is to use only the ESLShareButton. In this case, you simply add this element to the markup and set the required configuration with the attributes. The element has to be registered with `ESLShareButton.register()`. And that's it.

The second option to use the share component is to define the component configuration and bind the configuration to the ESLShareList component. After that, all you have to do is add an element with names or groups of social networks to the ESLShareList markup. The item content, consisting of a set of buttons, will be generated automatically. It's like you would add each button to the markup yourself and prescribe its configuration.

To use this option it is necessary to set the configuration for the list of buttons
```
ESLShareList.config(() => fetch('/assets/share/config.json').then((response) => response.json()));
```
and then register the item
`ESLShareList.register();`

### ESLShareList config

Config is a javascript object that contains two properties. The first one is `buttons` describing the configuration of the buttons. The second is `groups` which configure the groups. Both properties are arrays containing objects describing buttons and groups respectively.

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
What the properties of the button description object mean:
 - `action` - the name of the action to be performed by clicking on the button (recall that the action must be registered, the import was executed)
 - `icon` - the HTML content of the share icon
 - `iconBackground` - the color of the icon background (the value -  CSS data type represents a color). If you do not need to set the color, set the value to `transparent`
 - `link` - URL link (with placeholders) to share on a social network. Can contain the next placeholders:
    - {u} or {url} - URL to share on social network (shareUrl property on the ESLShareButton instance)
    - {t} or {title} - title to share on social network (shareTitle property on the ESLShareButton instance)
 - `name` - string identifier of the button (no spaces)
 - `title` - button title

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

### Setting the ESLShareList configuration

Before registering an ESLShareList item, you must set the component configuration. To do this, use the static ESLShareList.config() method of the component, which either receives as an argument a config object or a provider function that returns a promise of a config object.

For example:
```
ESLShareList.config(() => fetch('/assets/share/config.json').then((response) => response.json()));
```

### ESLShareButton

#### Attributes / Properties

 - `action` - name of share action that occurs after button click
 - `link` - link to share on a social network
 - `name` - social network identifier
 - `data-share-url` - URL to share on social network (current page URL by default)
 - `data-share-title` - title to share on social network (current document title by default)
 - `additional` - additional params to pass into a button (can be used by share actions)
 - `unavailable` - marker of availability of share button

#### Public API

 - `share` - the same as clicking the button, i.e. perform the share action

### ESLShareList

#### Attributes / Properties

 - `list` - list of social networks or groups of them to display (all by default). The value - a string containing the names of the buttons or groups (specified with the prefix group:) separated by spaces. For example: "facebook reddit group:default"
 - `data-share-url` - URL to share on social network (current page URL by default)
 - `data-share-title` - title to share on social network (current document title by default)
 - `ready` - ready state marker
#### Public API

 - `config` - static method to set config by a config object or a config provider function 
 - `build` - builds content of component

#### Events

 - `esl:share:ready` - event to dispatch on ready state of ESLShareList

### ESLShareAction

ShareAction is an interface that describes share actions. Custom user's actions realizing this interface should have next public methods:
 - `isAvailable` - checks if this action is available on the user's device
 - `share` - performs an action to share
