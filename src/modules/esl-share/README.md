# [ESL](../../../) Share

Version: *1.0.0-beta*.

Authors: *Dmytro Shovchko*, *Alexey Stsefanovich (ala'n)*.

***Important Notice: the component is under beta version, it is tested and ready to use but be aware of its potential critical API changes.***

<a name="intro"></a>

The ESL Share component provides the capability of integrating into a web page a sharing mechanism of the page on social media platforms, such as Facebook, Twitter, and Pinterest. The available share actions depend on the device but might include the clipboard, email applications, websites, social media, etc.

`<esl-share-button>` is a custom element that is used for displaying the "Share on social media" button. It is intended to share the page using the action specified on the button.

`<esl-share-list>` is a custom element that is used for showing the list of social media buttons. The element's content (a set of `<esl-share-button>`) is created automatically by specifying a list of networks or groups to display. Available social networks and their groups are listed in the configuration file.

`<esl-share-popup>` is a custom element used as a wrapper for content that can be displayed as a pop-up element. The content of the element consists of `<esl-share-button>`. `<esl-share-popup>` exists in a single instance and it refreshes its content every time its state changes to "open".

`<esl-share-popup-trigger>` is a custom element, that allows triggering `<esl-share-popup>` instance state changes.

`<esl-share>` is a versatile element that can function as both a list and a pop-up element. Depending on the specified value of the "mode" attribute, either an `<esl-share-list>` or an `<esl-share-popup-trigger>` is built inside. If you intend to use only one type of sharing component, it's not advisable to use this element in order to reduce the number of dependencies.

### Usage

Make sure you register the share actions that you are going to use on your pages. You don't need to do anything special for this, just import the necessary share actions - the registration will be done automatically.

Now you need to configure the share buttons and their groups (if you plan to use them). There are several ways to do this. These will be described further in the relevant section.

***Notice. If you don't plan to use any own custom button settings, you might be fine with the configuration from our library. Simply import the button you need from the `esl-share/buttons` folder. An additional bonus will be that in this case there is no need to register the action - the button will perform it on its own.***

Next, you have several options for using the share component. The first option is to use only the `<esl-share-button>`. In this case, you simply add this element to the markup and set the required configuration using attributes. The element needs to be registered with `ESLShareButton.register()`. And that's it.

```html
<esl-share-button name="facebook" default-icon></esl-share-button>
```

The second option to use the share component is to define the component configuration and bind it to the `<esl-share-list>`. After that, all you have to do is to add an element with names or groups of social networks to the `ESLShareList` markup. The item content, consisting of a set of buttons, will be generated automatically. It's the same as adding each button to the markup and prescribe its configuration manually. To use this option it is necessary to set the configuration for the list of buttons and then register the element.
`ESLShareList.register()` (it will register `ESLShareButton` automatically).

```html
<esl-share-list list="facebook linkedin mail copy"></esl-share-list>
```

The third option for using the share component is the same as the previous one, only the list of buttons is shown inside the pop-up window. All actions are similar to the previous one, except that you add the `<esl-share-popup-trigger>` element to the markup. The list of buttons that will be displayed in the pop-up window is set in the markup as a list of names and groups, absolutely identical to `<esl-share-list>`. To use this option it is necessary to set the configuration for the list of buttons and then register the element `ESLSharePopupTrigger.register()` (it will register `ESLShareButton` and `ESLSharePopup` automatically).

```html
<esl-share-popup-trigger list="facebook linkedin mail copy"></esl-share-popup-trigger>
```

The last option for using the share component includes the previous two. That is one element, but behaves differently. You add an `<esl-share>` element to the markup, specify a list of buttons, and add the "mode" attribute, in which you specify in which of the modes ("list" or "popup") it should work, and that's it. To use this option it is necessary to set the configuration for the list of buttons and then register the element `ESLShare.register()` (it will register `ESLShareButton`, `ESLShareList`, `ESLSharePopup` and `ESLSharePopupTrigger` automatically).

```html
<esl-share list="facebook linkedin mail copy" mode="list"></esl-share>
```

### Configuring the ESLShare components

ESLShare provides the ability to setup a component configuration globally. 
This means that you do not need to configure each button separately. 
You can set buttons and groups config globally and then it will be available for each `esl-share`, `esl-share-list`, or `esl-share-popup-trigger`. 
All of mentioned components use the same configuration instance stored in `ESLShareConfig.instance`.

To add a single button, group to the configuration, you can use the `append` method of the configuration:
```typescript
// Add 'facebook' button to the configuration
ESLShareConfig.append({
   name: 'facebook',
   action: 'media',
   // ...
});
// Add 'mygroup' group to the configuration
ESLShareConfig.append({
   name: 'mygroup',
   list: 'facebook twitter linkedin'
});
```

The `ESLShareConfig.append` accepts a list of buttons or groups as well:
```typescript
ESLShareConfig.append([
  {
    name: 'facebook',
    action: 'media',
    // ...
  },
  {
    name: 'linkedin',
    action: 'media',
    // ...
  }
]);
```

The `esl-share` module provides an out of the box configuration for the most popular social networks and sharing options.
To use it, you need to import required configuration from the `esl-share/buttons` directory it will automatically register in the `ESLShareConfig.instance`:

```typescript
// Register 'facebook' button ootb configuration
import '@exadel/esl/modules/esl-share/buttons/facebook';

// Register all buttons ootb configurations
import '@exadel/esl/modules/esl-share/buttons/all';
```

Note: configuration of the button or group appends to the existing configuration but overrides the existing one if the button or group with the same name already exists.

In case you need just a little fix up the existing configuration you can use ootb button config and then override it:

```typescript
import {facebook} from '@exadel/esl/modules/esl-share/buttons/facebook';
// Change icon of the facebook button
ESLShareConfig.append({
  ...facebook,
  icon: '<svg>...</svg>'
});
```

You can also override the configuration of the button or group in the runtime. 

The `esl-share` module supports configuration by the `ESLShareConfigInit` object
```typescript
export interface ESLShareConfigInit {
  /** List of share buttons configurations */
  buttons?: ESLShareButtonConfig[];
  /** List of share buttons groups configurations */
  groups?: ESLShareGroupConfig[];
}
```

The `ESLShareConfigInit` object can be passed to the `ESLShareConfig.set` method.
It is usefull when you have group you configuration in a single json file, or generate it in the runtime 
(depends on the user's locale, for example).

```typescript
import config from './config.json';
ESLShareConfig.set(config);
```

The `ESLShareConfig.set` method accepts a function that returns a promise of `ESLShareConfigInit` object 
or a Promise of the `ESLShareConfigInit` object:

```typescript
const configProvider = () => {
  const buttons = [];
  if (allowPrint) buttons.push(print);
  if (allowCopy) buttons.push(copy);
  return {buttons};
};
// ...
ESLShareConfig.set(configProvider);
```

```typescript
// Retrive config from the server based on the user's locale
const countryCode = document.;
ESLShareConfig.set(fetch(`/assets/share/config.${countryCode}.json`).then((response) => response.json()));
```


#### ESLShare config objects

Above it was told and shown how you can set the configuration of the component. 
But how does the configuration for the button or group look like?

As was mentioned above the cumulative `ESLShareConfigInit` config object consists of two properties: 
 - `buttons` - array of button configurations
 - `groups` - array of group configurations.

An example of a description of the button configuration:
```json
{
    "action": "media",
    "icon": "\u003csvg xmlns\u003d\"http://www.w3.org/2000/svg\" aria-hidden\u003d\"true\" fill=\"#fff\" focusable\u003d\"false\" role\u003d\"presentation\" style=\"background: #3c5996;\" viewBox\u003d\"0 0 27.99 28\"\u003e\u003cpath d\u003d\"M23 17.11l.55-4.24h-4.2v-2.71c0-1.23.34-2.06 2.1-2.06h2.25V4.29a31.62 31.62 0 00-3.28-.16c-3.24 0-5.46 2-5.46 5.61v3.13h-3.63v4.24H15V28h4.39V17.11z\"/\u003e\u003c/svg\u003e",
    "link": "//www.facebook.com/sharer.php?u\u003d{u}",
    "name": "facebook",
    "title": "Facebook"
}
```
or for example the configuration of the copy button
```json
{
    "action": "copy",
    "icon": "\u003csvg xmlns\u003d\"http://www.w3.org/2000/svg\" aria-hidden\u003d\"true\" fill=\"#fff\" focusable\u003d\"false\" role\u003d\"presentation\" style=\"background: #a0522d;\" viewBox\u003d\"0 0 28 28\"\u003e\u003cpath d\u003d\"M17 9.69l-7.43 7.43 1.18 1.18 7.43-7.43L17 9.69z\"/\u003e\u003cpath d\u003d\"M4.31 17.8c-.481.481-.48 1.29.00138 1.77l4.02 4.02c.481.481 1.29.483 1.77.00138l4.95-4.95c.481-.481.481-1.29-7e-7-1.78l-4.02-4.02c-.481-.481-1.29-.481-1.78 0l-4.95 4.95zm1.47.887l4.36-4.36 3.44 3.44-4.36 4.36-3.44-3.44zm7-9.37c-.481.481-.481 1.29 2.8e-7 1.78l4.02 4.02c.481.481 1.29.481 1.78 0l4.95-4.95c.481-.481.48-1.29-.00138-1.77l-4.02-4.02c-.481-.481-1.29-.483-1.77-.00138l-4.95 4.95zm1.47.889l4.36-4.36 3.44 3.44-4.36 4.36-3.44-3.44z\"/\u003e\u003c/svg\u003e",
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
 - `link` - URL link (with placeholders) to share on a social network. Can contain the next placeholders:
    - {u} or {url} - URL to share on social network (shareUrl property on the ESLShareButton instance)
    - {t} or {title} - title to share on social network (shareTitle property on the ESLShareButton instance)
 - `name` - string identifier of the button (no spaces)
 - `title` - button title
 - `additional` - optional additional params to pass into a button (can be used by share actions)

The configuration object of the group is simple, consisting of two properties:
 - `name` - string identifier of the group (no spaces)
 - `list` - list of buttons included in the group

An example of a description of the group configuration:
```json
{
    "name": "demo",
    "list": "facebook twitter linkedin wykop copy"
}
```
The group may include another group. So this configuration describing nested groups will be valid:
```json
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

Note: if default configuration does not used, you should import the required actions manually:
```typescript
  import '@exadel/esl/modules/esl-share/actions/copy';
  import '@exadel/esl/modules/esl-share/actions/media';
```


### ESLShareButton

#### Attributes / Properties

 - `action` - name of share action that occurs after button click
 - `link` - link to share on a social network
 - `name` - social network identifier
 - `share-url` - URL to share (current page URL by default)
 - `share-title` - title to share (current document title by default)
 - `additional` - additional params to pass into a button (can be used by share actions)
 - `default-icon` - marker to render default icon inside button on init
 - `unavailable` - marker of availability of share button

#### Observing changes in configuration

The button component is notified of any configuration changes. The button will update its action if the configuration has changed. Also, the button will redraw its content if the button contains an instruction to render the default icon.

#### Attributes cascading

If you want to utilize URL and title overrides within any parts of the page to share using the `share-url` and `share-title` attributes, there's no need to write these attributes on each button. You can write them once on the root element of the part for which these values are valid. Alternatively, if you want to override the values for the entire document, you can set them on the body of the HTML document.

The principle of cascading is similar to CSS variables. The value is searched from the element and up the tree to the document body itself. If the attribute is not found in parent elements, the default value is used.

#### Public API

 - `share` - the same as clicking the button, i.e. perform the share action

### ESLShareList

#### Attributes / Properties

 - `list` - list of social networks or groups of them to display (all by default). The value - a string containing the names of the buttons or groups (specified with the prefix group:) separated by spaces. For example: `"facebook reddit group:default"`
 - `share-url` - URL to share (current page URL by default)
 - `share-title` - title to share (current document title by default)
 - `ready` - ready state marker

#### Observing changes in configuration

The component is notified of any configuration changes. And, if during the check it turns out that the list of buttons inside the component changes, the component updates its content. Accordingly, in this case, the component itself also throws an event about its own content change.

#### Public API

 - `buttonsConfig` - getter that returns config of buttons specified by the list attribute

#### Events

 - `esl:share:changed` - event to dispatch on change of ESLShareList

### ESLSharePopup

This element is based on [ESLPopup](../esl-popup/README.md) element and exists in a single instance. Its shared instance adds directly to the document's body when any of `ESLSharePopupTrigger` requires showing this popup. It removes from the document's body on hide action. 
`ESLSharePopup` renders buttons from the list on show action. If an `ESLSharePopup` element with the desired set of buttons already exists in the document body, the existing one will be reused. 

#### Observing changes in configuration

The popup is notified of any configuration changes. In this case, the component is simply hidden if it is in an open state, i.e. there is a set of rendered buttons inside. So, when you open it again, it will simply redraw the new buttons inside.

#### Public API

 - `sharedInstance` - static getter that returns shared instance of ESLSharePopup

### ESLSharePopupTrigger

A trigger element is based on [ESLTrigger](../esl-trigger/README.md) to activate the popup with share buttons, which will activate the popup when you hover over it. Also, one additional activity of the `ESLSharePopupTrigger` is to forward the `share-title` and `share-url` attributes from the root `ESLSharePopupTrigger` component (or its parents if not defined on the trigger element) to the popup. So it's possible for components with the same set of buttons but different URLs and titles to share to use the same popup.

#### Attributes / Properties

 - `list` - list of social networks or groups of them to display (all by default). The value - a string containing the names of the buttons or groups (specified with the prefix group:) separated by spaces. For example: `"facebook reddit group:default"`
 - `popup-initial-params` - initial params to pass into popup on show action (Default: `{position: 'top', hideDelay: 220}`)
 - `share-url` - URL to share (current page URL by default)
 - `share-title` - title to share (current document title by default)
 - `track-hover` - [MediaQuery](../esl-media-query/README.md) to define allowed to track hover event media. (Default: `all`)

### ESLShare

#### Attributes / Properties

 - `list` - list of social networks or groups of them to display (all by default). The value - a string containing the names of the buttons or groups (specified with the prefix group:) separated by spaces. For example: `"facebook reddit group:default"`
 - `share-url` - URL to share (current page URL by default)
 - `share-title` - title to share (current document title by default)
 - `trigger-initial-params` - initial params for the `ESLSharePopupTrigger` to be created (Default: `{trackClick: true, trackHover: true}`)
 - `mode` - rendering mode of the share buttons. The `list` and `popup` are available (list by default)
 - `ready` - ready state marker

#### Modes

There are two modes available to render buttons.

There are two modes available to render buttons. In list mode, the `ESLShareList` is drawn inside the component as a list. Nothing special. 

Similarly, in popup mode, the `ESLSharePopupTrigger`` is drawn inside component and shows a popup with the specified list of buttons.

#### Public API

 - `config` - static method to get or update config with a promise of a new config object or using a config provider function (***Deprecated***)

### ESLShareAction

**ESLShareBaseAction** is an interface that describes share actions. Custom user's actions realizing this interface should have next public methods:
 - `isAvailable` - checks if this action is available on the user's device
 - `share` - performs an action to share
