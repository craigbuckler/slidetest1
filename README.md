# Slides (test 1)

An HTML presentation experiment.

Install the [esbuild](https://esbuild.github.io/) build system with:

```bash
npm install
```

Run in development mode:

```bash
npm start
```

This builds a site to `build` and starts a local development server. Open `http://localhost:8111/` in your browser. All resources rebuild themselves when files change. CSS hot reloads, but other updates require a browser refresh.

Create a production build with minified CSS and JavaScript:

```bash
npm run build
```


## Build settings

Source files are located in `./src`.

Build files are built to `./build`.

Development mode can be configured in `.env.dev`.

`.env.prod` overrides `.env.dev` defaults when creating a production build.


## Creating slides

Create an outer `.slides` container. Each child element is an individual slide with content, e.g.

```html
<article class="slides">

  <section>

    <h1>Slide 1 title</h1>
    <p>Slide 1 text</p>

  </section>

  <section>

    <h1>Slide 2 title</h1>
    <p>Slide 2 text</p>

  </section>

</article>
```

Slides (`<section>` elements here) always fill the browser viewport. Text is set to scale in `src/css/03-elements/_block.css` but can be overridden.


## Activation CSS

The following classes are applied to each slide (`<section>` element above) as the user scrolls:

* `.in1` - slide has at least one pixel in view
* `.in25` - slide is 25% or more in view
* `.in50` - slide is 50% or more in view
* `.in75` - slide is 75% or more in view
* `.active` - the active slide (most in view)
* `.inactive` - all other slides

An `--inview` custom property between `0` and `1` is assigned to each slide. For example, if the first slide has a value of `0.4` the second slide will have a value of `0.6`. This value can be used to create `.in` animations ([see below](#animation-classes)).

Custom properties are also applied to the `body` element:

* `--slide` - the currently active slide (zero based - `0` is the first slide)
* `--progress` - progress through whole presentation from `0` (top of first slide) to `1` (top of last slide)


## Activation JavaScript

A JavaScript `active` event raised on a slide when it's fully in view. The event `.detail` property is an object with the following values:

* `.slideElement` - active slide's DOM node
* `.slideNumber`  - the currently active slide (zero based - `0` is the first slide)

The following example attaches an event handler to the outer `.slides` container because the event bubbles up:

```js
document.querySelector('.slides').addEventListener(
  'active',
  e => {
    console.log( 'on slide:' e.detail.slideNumber + 1 );
    console.log( 'active slide ID:', e.detail.slideElement.id );
  }
);
```

Note that all slides are assigned an ID unless you explicitly define one. The first slide has the ID `s1`, the second is `s2`, etc. The URL `#` target is changed as you scroll so specific slides can be bookmarked and the back/next history is retained.


## Animation classes

Slide content such as the `<h1>` and `<p>` elements can have animation classes defined.

Example animations are defined in `src/css/02-design/_animations.css` although you can add your own based on the [activations](#activation-css) above.

`.in<name>` classes apply an animation proportional to the slide in view:

* `.infade` - opacity (0% to 100%)
* `.inscale` - scale (0% to 100%)
* `.inrotate` - rotation (0 to 360 degrees)
* `.inleft` - fly in from left
* `.inright` - fly in from right
* `.inup` - fly in from bottom
* `.indown` - fly in from top

For example, a slide that's 70% in view with `.inscale` applied is 70% of it's final size.

`.show<name>` classes apply an animation only when the slide is fully within view:

* `.showfade` - opacity (0% to 100%)
* `.showscale` - scale (0% to 100%)
* `.showrotate` - rotation (0 to 360 degrees)
* `.showleft` - fly in from left
* `.showright` - fly in from right
* `.showup` - fly in from bottom
* `.showdown` - fly in from top

Animations can be delayed by applying:

* `.delay1` - delay for 0.5s
* `.delay2` - delay for 1.0s
* `.delay3` - delay for 1.5s

Classes can be combined, e.g. `class="infade inscale"` will fade and scale, although you would not normally combine `.in` and `.show` animations.

You can apply animations to the slide element (`<section>` element above), although this can have inconsistent results depending on the browser. In some cases, it can break keyboard navigation.
