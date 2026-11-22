# Document the SSR Dance

## Bruce's Ask

[Demo1](../demo/Demo1.html) contains quite a bit of nuanced markup to make the hydration of state seamless during SSR.  Can you please document this in the README.md?

Please add your implementation notes below.

## Claude's Implementation Notes

Added a new section, **"The SSR dance, step by step"**, to [README.md](../README.md), right after the existing "SSR support" section.  It contains:

- A table of the five players (be-hive, id-generation, imp-h, soak-up, be-gone) and what each one contributes.
- An annotated copy of Demo1's markup, with a comment on each nuanced attribute.
- A six-step timeline: stream → id generation → user interaction → definition → handoff → cleanup.  It includes a before/after table of what id-generation rewrites.
- Rules of thumb for anyone adapting the pattern to another component.

The behavior described comes from reading the sources in node_modules, not from running the demo: `id-generation/genIds.js`, `soak-up/soak-up.js`, `be-gone/be-gone.js`, their emc.json files, the mount-observer `Synthesizer`, and `GenIds` / `CedeScript` handlers.

### Things I noticed but did not change (worth a look)

1. **The `itemprop` copy in soak-up probably does nothing.**  soak-up assigns `span['itemprop'] = label['itemprop']`.  Browsers don't expose a reflected lowercase `itemprop` property (the microdata DOM API was dropped), so this most likely copies `undefined` as an expando instead of setting the attribute.  If the goal is for the span to carry `itemprop=createDemoLabel`, soak-up may need an attribute fallback, or the rule could target something else.  The README mentions the `itemprop` copy without promising the attribute ends up set.
2. **The "Write article" stand-in isn't disabled.**  The second `scratch-box` has `disabled`, but its stand-in `<input>` doesn't.  So a user can tick it before hydration, and then the box becomes disabled-but-checked.  Adding `disabled` to that stand-in input would make the two states match.
3. **`type=cede` vs `type=precede`.**  The imp-h README describes the template handoff for `<script type="precede">`, which imp-h flips to `cede` once root.html is fetched.  Demo1 uses `type=cede` directly.  It apparently works (presumably templateMaker picks up the shadow root that imp-h attaches), but there may be a race worth checking.  I described step 4 loosely so the README stays accurate either way.
4. **`<remove -id>` stays in the DOM.**  Nothing removes it after id generation.  It's harmless (an inert unknown element), and the README says so.  A self-removing trigger, or putting `-id` on the last `scratch-box`'s span as the soak-up README does, would avoid the leftover.
5. **There's a brief overlap during the handoff.**  be-gone removes the style block (revealing `scratch-box`) as soon as the element is defined, and the stand-ins disappear only after soak-up runs.  In between, both may render for a moment.  The fieldset's `max-height:488px; overflow:hidden` keeps this from showing up as layout shift, so I described it that way.

## Bruce's Response I

The write up looks good.  You pointed out how the remove element is the only element that remains that serves no purpose.  Can you suggest a good solution to this conundrum?

## Claude's Response I

### Recommendation: put `-id` on an element that is already there

Put the trigger on the last element in the scope that needs ids, which is the label span inside the last `scratch-box`.  The soak-up and be-gone READMEs already do this.

```html
<scratch-box defer-enh-soak-up enh-soak-up="
    name, checked as value 
    from #{{exercise}}">
    <span -id slot=labelTxt defer-soak-up soak-up="
        textContent, itemprop from #{{exerciseLabel}}"></span>
</scratch-box>
<!-- <remove -id></remove> is no longer needed -->
```

Here's why this works with the code as it is today:

- **The span finds the right scope.**  genIds searches from the trigger with `closest('[id-scope],fieldset,[itemscope]')`.  `scratch-box` matches none of those, so the scope is still the fieldset.
- **Nothing needs a forward reference.**  Every `{{...}}` the span refers to, and every element that needs an id, is already in the DOM before the span.
- **Nothing is left over.**  genIds removes the `-id` attribute (and `defer-soak-up`) from the span, and the span stays because it is a real part of the component.
- **No library changes are needed.**  It's a one-line edit to Demo1.

There are two trade-offs:

1. **The trigger is tied to whichever task happens to be last.**  Anyone who adds or reorders tasks, or generates the list in a server-side loop, has to remember to move `-id`.  In a loop, it's one conditional ("if last item, add `-id`"), which is easy but easy to forget.
2. **The span isn't strictly the last element in the scope.**  In the first `scratch-box`, the `cede` script follows its span.  That doesn't matter, because the script has no `{{...}}` placeholders.

### If you want a trigger that doesn't depend on the markup: make it remove itself

If you'd rather keep a separate trigger at the end of the scope, which is easier to read and survives reordering, the cleanest fix is in id-generation.  It would remove a trigger whose only job is to be a trigger.  Two possible ways to opt in:

- An explicit value, `<template -id=remove></template>`.  It's clear and leaves no room for guessing.
- A convention: if the trigger is an empty `<template>` with no other attributes, genIds removes it after processing.  A template is inert and renders nothing, so it's the natural thing to use as a trigger.  Using an empty template for anything else would be unusual.

I'd lean toward the explicit `-id=remove` (a few lines in `genIds.js`, right after `trigger.removeAttribute('-id')`).  It doesn't guess about what the developer meant, and the markup describes itself.

### What I'd do

Use the first approach in Demo1 now, since it needs no new code.  Then decide separately whether `-id=remove` is worth adding to id-generation for the server-loop case.  I can make the Demo1 change, update the README section that mentions the leftover `<remove>` element, or both.