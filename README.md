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
    <span slot=labelTxt>Excercise</span>
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

