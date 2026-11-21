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