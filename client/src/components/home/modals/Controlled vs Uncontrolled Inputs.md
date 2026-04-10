# Internal DOM state vs React state

Every `<input>` element in the browser has its own internal state managed by the DOM itself — specifically, the `value` property on the HTMLInputElement. When you type "hello" into an input, the browser automatically updates `inputElement.value` to "hello". This happens at the DOM level, with **zero involvement from React.**

**React state**, on the other hand, lives in a JavaScript variable managed by useState. It's completely separate from the DOM.

# Controlled vs Uncontrolled inputs

This is where the distinction matters:

## Controlled (your current approach)

`<Input value={formData.year} onChange={handleChange} />`

- You're telling React: "the value of this input is whatever `formData.year` says it is"
- On every keystroke:
    1. Browser fires `onChange` with the new character
    2. `handleChange` calls `setFormData({ ...formData, year: newValue })`
    3. React re-renders
    4. React pushes `formData.year` **back down** to the DOM, setting `inputElement.value`
- React state is the **source of truth**. The DOM state is just a mirror.

## Uncontrolled (RHF's approach with register())

`<Input {...form.register("year")} defaultValue={2026} />`

- The input is **not** given a `value` prop
- You type, the browser updates `inputElement.value` directly
- React **doesn't know or care** — no re-render happens
- RHF holds a `ref` to the input, so when you submit, it reads `inputElement.value` straight from the DOM
- The DOM is the **source of truth**. React state is only read at submit time.
