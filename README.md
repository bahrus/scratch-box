# scratch-box

<a href="https://nodei.co/npm/scratch-box/"><img src="https://nodei.co/npm/scratch-box.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/scratch-box">

scratch-box is a form associated custom element web component wrapper around the ["CUSTOM ANIMATED CHECKBOXES" codepen](https://codepen.io/SaraSoueidan/pen/40433575e3d0d026c7d9c00eb45522a1?editors=1100) by Sara Soueidan.

## Declarative Custom Element

This is the world's first visual web component built with [custom element features](https://github.com/bahrus/assign-gingerly#custom-element-features) and [Declarative Custom Element cede scripts](https://github.com/bahrus/mount-observer#custom-element-definition-cede-scripts).  It is "code-free". In particular, it draws from the [el-maker](https://www.npmjs.com/package/el-maker) base class module package, only loading ("dependency injecting") those features that are actually used, as needed.  It is entirely built with a static html file [root.html](/root.html) and a JSON file [el-maker.json](/el-maker.json).  Editing JSON by hand is error-prone and doesn't lend itself to Typescript checking.  To overcome this, the JSON file is built and managed from [el-maker.mjs](/el-maker.mjs) using command:

```
npm run build-el-maker
```

This watches for changes to the mjs file and automatically rebuilds the el-maker.json file.

## Dual Mode

The [root.html](/root.html) file mentioned above can actually be opened via a static file web server, and the basic functionality of the web component can already be demo'd.  Nothing could be easier! All that's missing is some behind the scenes dynamic functionality as far as linking up to an HTML form, and the ability to pass in the checked value dynamically. [TODO -- support passing in via querystring].

## SSR support

To use this web component, the root.html file needs to either be embedded in the HTML stream for the landing page, or (lazily) imported/streamed in.  In the main [demo page](/demo/DemoCompact.html), we see a full-blown SSR example, including progressing switching from raw checkboxes with minimal styling to the *scratch-box* component, passing any edits made to the raw checkboxes to the *scratch-box* during hydration without skipping a beat.

This optional true SSR progressive enhancement support is made possible with the help of two additional, optional element enhancements -- [soak-up](https://www.npmjs.com/package/soak-up) and [be-gone](https://www.npmjs.com/package/be-gone).

## The SSR dance, step by step

[Demo1](/demo/Demo1.html) packs a lot of nuance into a small amount of markup.  The goal is:

1.  The user sees functional checkboxes as soon as the HTML arrives, before any JavaScript loads.
2.  Anything the user clicks before *scratch-box* is ready is not lost.
3.  When *scratch-box* upgrades, it takes over with no layout shift and no loss of state.

Five players make this work:

| Player | Role in the dance |
|--------|-------------------|
| [be-hive](https://www.npmjs.com/package/be-hive) | Hosts the enhancement registrations (`<script type=emc>`), and its built-in handlers generate ids (`-id`) and define custom elements from `<script type=cede>`. |
| [id-generation](https://www.npmjs.com/package/id-generation) (via mount-observer) | Turns `{{name}}` placeholders into unique ids, wiring stand-in labels to stand-in inputs and to the elements that will absorb them. |
| [imp-h](https://www.npmjs.com/package/imp-h) | Fetches [root.html](/root.html) and supplies the shadow DOM template. |
| [soak-up](https://www.npmjs.com/package/soak-up) (🧽) | Once *scratch-box* is defined, copies state from the stand-in elements into the real component, then deletes the stand-ins. |
| [be-gone](https://www.npmjs.com/package/be-gone) (👻) | Removes the scaffolding (wrapper divs and the temporary stylesheet) when it is no longer needed. |

### The markup, annotated

```html
<be-hive>
    <!-- register be-gone -->
    <script type=emc src="be-gone/emc.json"></script>
    <!-- soak-up needs the pattern-statement parser, so register that first -->
    <script type=emc-parser
        src="be-hive/parsers/parse-pattern-statements.js"
        parser-name=parse-pattern-statements></script>
    <script type=emc
        src="soak-up/emc.json"
        wait-for-parsers=parse-pattern-statements></script>
</be-hive>
<form>
    <!-- 
        itemscope + fieldset: the id-generation scope (and the scope soak-up searches).
        disabled: no interaction until the ids are wired up (id-generation removes it).
        max-height/overflow: limits any shift during the handoff.
    -->
    <fieldset style="max-height:488px;overflow:hidden;" itemscope disabled name=tasks>

        <!-- 👻 Disappears once it no longer contains any divs -->
        <div be-gone-when-missing=div>

            <!-- 👻 Each stand-in disappears once soak-up has removed its label and input -->
            <div class=stand-in be-gone-when-missing="*">
                <!-- {{| x}}: generate an id, and set itemprop=x -->
                <!-- data-for={{x}}: becomes for=<generated id of x> -->
                <label data-id="{{| createDemoLabel}}" data-for={{createDemo}}>Create demo</label>
                <!-- {{@ x}}: generate an id, and set name=x -->
                <input data-id="{{@ createDemo}}" type=checkbox>
            </div>
            ...

            <!-- 👻 Disappears once scratch-box is defined -->
            <style be-gone-when-defined="scratch-box">
                .stand-in { height:145px; }       /* reserve the height of a scratch-box */
                scratch-box { display: none; }    /* hide the not-yet-upgraded elements */
            </style>
        </div>

        <!-- 
            🧽 defer-enh-soak-up: wait for id-generation to fill in #{{createDemo}}.
            The enh- prefix is used because scratch-box is a custom element and owns
            its unprefixed attributes.
        -->
        <scratch-box defer-enh-soak-up enh-soak-up="
                name, checked as value
                from #{{createDemo}}
            "
            imp-h="scratch-box/root.html">
            <!-- 🧽 Copy the stand-in label's text into the slot -->
            <span slot=labelTxt defer-soak-up soak-up="
                textContent, itemprop
                from #{{createDemoLabel}}
            "></span>
            <!-- define scratch-box declaratively, using el-maker + features.json -->
            <script type=cede data-extends=el-maker src="scratch-box/features.json"></script>
        </scratch-box>
        ...

        <!-- 
            Triggers id generation for the enclosing fieldset.  It is placed last
            so that everything it needs to wire up has already streamed in.
        -->
        <remove -id></remove>
    </fieldset>
</form>
```

Only the first *scratch-box* needs the `imp-h` attribute and the `cede` script. Once the element is defined, every `scratch-box` tag on the page upgrades.

### The timeline

**1. HTML streams in, no JavaScript yet.**  The server-side include (`<!-- #include virtual="/imports.html" -->`) adds the import map.  The temporary `<style>` gives each `.stand-in` the height of a real *scratch-box* and hides the not-yet-upgraded `scratch-box` tags, so the user sees three plain labeled checkboxes in the space the final UI will occupy.  The fieldset is `disabled` for now, because the labels aren't linked to their inputs yet.

**2. be-hive loads, and ids are generated.**  When `<remove -id>` mounts, id-generation processes its scope: the closest `fieldset` / `[itemscope]` ancestor.  For the first task, it:

| Before | After |
|--------|-------|
| `<input data-id="{{@ createDemo}}">` | `<input id=gid-0 name=createDemo data-id=createDemo>` |
| `<label data-id="{{\| createDemoLabel}}" data-for={{createDemo}}>` | `<label id=gid-1 itemprop=createDemoLabel data-id=createDemoLabel for=gid-0>` |
| `enh-soak-up="... from #{{createDemo}}"` | `enh-soak-up="... from #gid-0"` |
| `soak-up="... from #{{createDemoLabel}}"` | `soak-up="... from #gid-1"` |

(The exact numbers depend on what else has already been processed on the page.)

id-generation only substitutes `#{{...}}` inside a custom attribute if the element also has a matching `defer-` attribute (`defer-soak-up` covers `soak-up`, and `defer-enh-soak-up` covers `enh-soak-up`).  When it finishes, it removes all of the `defer-*` attributes and the fieldset's `disabled` attribute.  So two things happen at once:

*   The stand-in checkboxes become interactive, and clicking a label toggles its checkbox.
*   The soak-up enhancements, which were held back by `defer-*`, are free to attach, now pointing at real ids.

**3. The user may interact with the stand-ins.**  These are ordinary form controls, so nothing special is needed to capture state.  The browser keeps it.

**4. scratch-box gets defined.**  imp-h fetches [root.html](/root.html) and takes the markup between `<?start>` and `<?end>`.  The `cede` script registers `scratch-box`, built from the [el-maker](https://www.npmjs.com/package/el-maker) base class with the features listed in [features.json](/features.json) (form association, observed `name` / `disabled`, property routing to the shadow input, and font loading).

**5. The handoff.**  As soon as `customElements.whenDefined('scratch-box')` resolves:

*   👻 The `<style be-gone-when-defined="scratch-box">` removes itself.  The `scratch-box` elements are no longer hidden.
*   🧽 Each `enh-soak-up` on a `scratch-box` reads the stand-in input's **current** `name` and `checked` properties, assigns them to the component's `name` and `value`, then removes the input.  This is how a click made in step 3 survives hydration.
*   🧽 Each `soak-up` on a `span[slot=labelTxt]` copies the stand-in label's `textContent` (and `itemprop`) into the span, then removes the label.  The label text only needs to be sent once by the server.

**6. Cleanup.**

*   👻 Each `.stand-in` div has `be-gone-when-missing="*"`.  Once soak-up has removed its label and input, it has no child elements left, so it removes itself.
*   👻 The outer wrapper has `be-gone-when-missing=div`.  Once all the stand-in divs are gone, it removes itself too.

What remains is three upgraded, form-associated *scratch-box* elements carrying the names, checked state and label text that the user saw and edited, with no layout shift.  The only leftover is the empty, inert `<remove>` element.

### Rules of thumb when adapting this pattern

*   Put the element with `-id` **last** within the scope.  id-generation doesn't forward reference, so anything that streams in after the trigger may be missed.
*   Every attribute that contains `#{{...}}` and isn't a built-in id-referencing attribute needs a matching `defer-` attribute, or it won't be substituted.  Because id-generation removes that `defer-` attribute when it's done, the same attribute also keeps the enhancement from starting before the ids exist.
*   Keep the scope container (`fieldset`, `[itemscope]` or `[id-scope]`) `disabled` until the ids are generated.  Inputs inside a disabled fieldset are disabled too.
*   Match the stand-in height to the real component's height, and hide the undefined custom element in the same stylesheet that be-gone removes.  That is what avoids layout shift.
*   Each soak-up rule removes its source element after copying it.  So a stand-in's state can be absorbed only once, by a single target.

## API Reference

View the [custom element manifest for scratch-box](https://wc-info.bahrus.workers.dev/?href=https://cdn.jsdelivr.net/npm/scratch-box@0.0.15/custom-elements.json&stylesheet=https://cdn.jsdelivr.net/npm/wc-info@0.0.182/simple-ce-style.css&embedded=false&tags=&ts=2025-10-07T07:54:33.702Z&intro=scratch-box+custom+element).

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

