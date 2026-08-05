# scratch-box

<a href="https://nodei.co/npm/scratch-box/"><img src="https://nodei.co/npm/scratch-box.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/scratch-box">

scratch-box is a web component wrapper around the ["CUSTOM ANIMATED CHECKBOXES" codepen](https://codepen.io/SaraSoueidan/pen/40433575e3d0d026c7d9c00eb45522a1?editors=1100) by Sara Soueidan.

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

