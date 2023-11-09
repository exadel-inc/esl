# [ESL](../../../) Media

Version: *1.3.0*

Authors: *Alexey Stsefanovich (ala'n)*, *Yuliya Adamskaya*, *Julia Murashko*, *Natallia Harshunova*

<a name="intro"></a>

**ESLMedia** is a custom element, that provides an ability to add and configure media (video / audio) 
using a single tag as well as work with external providers using simple native-like API.

---

### Supported Features:
 
 - extendable `MediaProviders` implementation for different media types. Out-of-the-box support of:
   - HTMLAudio (`audio` type)
   - HTMLVideo (`video` type)
   - Youtube (`youtube` type)
   - Brightcove (`brightcove` type)
   - Abstract Iframe (`iframe` type)
 
 - `load-condition` - restriction to load esl-media. Uses [ESLMediaQuery](../esl-media-query/README.md) syntax.
 
 - `play-in-viewport` - feature that restricts active state to only visible components on the page.
 
 - `manual initialization` - component will not be initialized until `disable` marker is removed.
 
 - `group manager` - to allow single active player in group restriction.
 
 - `fill mode` - feature that allows managing player rendering option in bounds of given element area.
 
 - state change events (`esl:media:load`, `esl:media:error`, `esl:media:play`, etc).
 
 - provides 'HTMLMedia like' API that is safe and will be executed after real API is ready.

### Attributes:

 - `media-src` (for html media / iframe) - media resource src
 - `media-id` (for youtube/brightcove) - id of media resource
 - `media-type` - type of media provider
 
 - `group` (optional) - group name, only one media player can be active in bounds of the group
 
 - `ready-class` - class to add when the resource is ready
 - `ready-class-target` - [ESLTraversingQuery](../esl-traversing-query/README.md) to define a target for `ready-class`

 - `disabled` (boolean) - marker that prevents media api initialization. Deprecated alias for *manual* mode of `lazy` attribute

 - `lazy` - an attribute that governs the loading behavior of media resources on a webpage. 
 This attribute provides enhanced control over when media content is fetched and displayed.
   - `none` (or attribute absence) - triggers the immediate loading of media content as soon as the webpage is loaded;
   - `manual` - in this mode, media content loading is blocked until the attribute is removed manually from the consumer's code;
   - `auto` - the auto mode ensures that media content starts loading when it becomes visible in the browser viewport or is in close proximity to it. 
 This behavior is determined using the Intersection Observer API, optimizing loading times for content that is likely to be viewed by the user.
 If the media is both intersecting and has a sufficient intersection ratio, the lazy attribute is removed from the media element.

 - `fill-mode` (optional) - enables resource size management. Available options:
   - `auto` - default, media area will be stretched to element size
   - `cover` - media area will be zoomed in/out, cropped and centered to cover element area
   - `inscribe` - media area will be inscribed into element area
 
 - `aspect-ratio` (optional) - override aspect ratio for media resource. Supported formats:
   - `1.5` - width / height (`3:2` proportion in this example)
   - `16:9` - colon-separated proportion
   - `16/9` - slash-separated proportion

 - `play-in-viewport` (boolean) - auto stop media which is out of viewport area
 
 - `autofocus` (boolean) - set focus to the player when the media starts playing
 
 - `autoplay` (boolean) - start to play automatically on initialization 
 *(note: initialization doesn't happen until `disabled` attribute is removed from the element)*
 
 - `controls` (boolean) - show media player controls
 
 - `loop` (boolean) - play media in loop
 
 - `mute` (boolean) - mute media
 
 - `playsinline` (boolean) - allow playing media inline (media player will not request special control over device)

### Readonly Attributes:
 
 - `error` (boolean) - marker that indicates that media API has loaded with error
 - `ready` (boolean) - marker that indicates that media API has loaded
 - `played` (boolean) - marker that indicates that media has played
 - `active` (boolean) - marker that indicates that media is playing
 
### Events: 
 - `esl:media:error` - (bubbles) fires when API is initialized with error
 - `esl:media:ready` - (bubbles) fires when API is ready
 - `esl:media:play` - (bubbles) fires when esl-media starts playing
 - `esl:media:paused` - (bubbles) fires when esl-media is paused
 - `esl:media:ended` - (bubbles) fires when esl-media is ended
 - `esl:media:detach` - (bubbles) fires after esl-media provider is detached (reinitialized / disconnected from the DOM)
 - `esl:media:managedpause` - (bubbles) fires when media was paused by esl-media group restriction manager
 
### Examples:
```html
<esl-media
    media-type="youtube"
    media-id="##MEDIAID##"
    title="Video Title"     
    [ disabled ]    
    [ group="mediaGroup" ]
></esl-media>
```
