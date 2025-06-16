# ESL Carousel Container Class Plugin <i class="badge badge-sup badge-warning">beta</i>

<a name="intro"></a>

The `esl-carousel-class-behavior` is a plugin (mixin) for `ESLCarousel` that provides advanced control over the `container-class` feature. 
By default, the `container-class` attribute works out-of-the-box in `default` mode, where classes are updated on the container after the slide change. 
The plugin enables a `proactive` mode, where classes are updated as soon as the slide change starts, which can be useful for certain animation types.

**Note:** The plugin is currently in beta and only supports the `mode` configuration.

## Configuration
The `esl-carousel-class-behavior` plugin uses the ESLMediaQuery syntax for configuration. 
The only supported configuration option is `mode`, which can be set to either `default` or `proactive`.
- `default`: The container's classes are updated after the slide change completes. THis is the default ESLCarousel behavior, the plugin is not needed if you use only this mode.
- `proactive`: The container's classes are updated as soon as the slide change starts, before the transition begins. This mode is useful for animations that require the container class to be updated immediately.

NOTE: As was previously mentioned, the plugin value supports the ESLMediaQuery syntax, which allows you to switch between different modes based on animation and renderer you use.

NOTE: Plugin does not change target for the `container-class` attribute, so if behaves exactly like ESLCarousel's API defines it (based on `container` attribute).

## Usage
To use the mixin, register the `ESLCarouselContainerClassMixin`:

```javascript
EslCarouselClassBehaviourMixin.register();
```

Then use the mixin on any `esl-carousel` element where you want to control container classes:
```html
<esl-carousel esl-carousel-class-behavior="proactive">
  <ul esl-carousel-slides>
    <li esl-carousel-slide container-class="my-slide-class-1">Slide 1</li>
    <li esl-carousel-slide container-class="my-slide-class-2">Slide 2</li>
  </ul>
</esl-carousel>
```

To use different modes for different renderers/media conditions:
```html
<esl-carousel media="@XS|@+SM" type="css-slide|css-fade" esl-carousel-class-behavior="default|proactive">
  ...
</esl-carousel>
```
or
```html
<esl-carousel media="@XS|@+SM" type="css-slide|css-fade" esl-carousel-class-behavior="default | @+SM => proactive">
  ...
</esl-carousel>
```
