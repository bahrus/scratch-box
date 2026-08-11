# scratch-box

<a href="https://nodei.co/npm/scratch-box/"><img src="https://nodei.co/npm/scratch-box.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/scratch-box">

scratch-box is a form associated custom element web component wrapper around the ["CUSTOM ANIMATED CHECKBOXES" codepen](https://codepen.io/SaraSoueidan/pen/40433575e3d0d026c7d9c00eb45522a1?editors=1100) by Sara Soueidan.

## Declarative Custom Element

This is the world's first visual web component, built with [custom element features](https://github.com/bahrus/assign-gingerly#custom-element-features) and [Declarative Custom Element cede scripts](https://github.com/bahrus/mount-observer#custom-element-definition-cede-scripts).  It is "code-free". In particular, it draws from the [el-maker](https://www.npmjs.com/package/el-maker) base class module package, only loading those features that are actually used, as needed.  It is entirely built with a static html file [root.html](/root.html) and a JSON file [el-maker.json](/el-maker.json).  Editing JSON by hand is error-prone and doesn't lend itself to Typescript checking.  So the JSON is built from [el-maker.mjs](/el-maker.mjs) using command

```
npm run build-el-maker
```

This watches for changes to the mjs file and automatically rebuilds the el-maker.json file.

## Dual Mode

The [root.html](/root.html) file mentioned above can actually be opened via a static file web server, and the basic functionality of the web component can already be demo'd.  Nothing could be easier! All that's missing is some behind the scenes dynamic functionality as far as linking up to an HTML form, and the ability to pass in the checked value dynamically. [TODO -- support passing in via querystring].

## SSR support

To use this web component, the root.html file needs to either be embedded in the HTML stream for the landing page, or (lazily) imported/streamed in.  In the main [demo page](/demo/DemoCompact.html), we see a full-blown SSR example, including progressing switching from raw checkboxes with minimal styling to the *scratch-box* component, passing any edits made to the raw checkboxes to the *scratch-box* during hydration without skipping a beat.

This optional true SSR progressive enhancement support is made possible with the help of two additional, optional element enhancements -- [soak-up](https://www.npmjs.com/package/soak-up) and [be-gone](https://www.npmjs.com/package/be-gone).

To use from CDN:

```html
<scratch-box imp-h="scratch-box/root.html">
    <span slot=labelTxt>Create demo</span>
</scratch-box>
<scratch-box>
    <span slot=labelTxt>Write article</span>
</scratch-box>
<scratch-box>
    <span slot=labelTxt>Exercise</span>
</scratch-box>
<script type="importmap">
{
    "imports": {
        "scratch-box/": "https://cdn.jsdelivr.net/npm/scratch-box@0.0.14/",
        "be-bound/": "https://esm.sh/be-bound@0.0.38/"
    }
}
</script>
<script type=module src=https://esm.sh/imp-h@0.0.4 crossorigin="anonymous"></script>
<script type=module src=https://esm.sh/xtal-element@0.0.636/index.js crossorigin=anonymous></script>
```

## Viewing Demos Locally

1. Install git
2. Fork/clone this repo
3. Install node.js
4. Open command window to folder where you cloned this repo
5. > git submodule add https://github.com/bahrus/types.git types
6. > git submodule update --init --recursive
7. > npm install
8. > npm run serve
9. Open http://localhost:8000/ in a modern browser

