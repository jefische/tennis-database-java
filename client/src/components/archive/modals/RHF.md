Each field you want RHF to manage needs a `<Controller>` wrapper (or you use `register()` for simple inputs). Here's the breakdown:

**Two ways to connect fields to RHF:**

## 1. `register()` — simpler, for native inputs

`<Input {...form.register("youtubeId")} type="text" placeholder="..." />`

Works for `<Input>`, `<Textarea>`, and any component that forwards standard props (`onChange`, `onBlur`, `ref`, `value`). This is the lighter approach — no wrapper needed.

## 2. `<Controller>` — required for custom components

```
<Controller
  name="tournament"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Tournament</FieldLabel>
      <Select value={field.value} onValueChange={field.onChange}>
        {/* ... */}
      </Select>
      {fieldState.error && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

Required for Radix `<Select>`, `<Switch>`, `<Checkbox>`, `<RadioGroup>` — anything that uses `onValueChange` instead of `onChange`, because `register()` expects native DOM events.

For your form specifically:

Field: Approach

- `tournament`: `<Controller>` (Radix Select)
- `year`: `register("year", { valueAsNumber: true })`
- `youtubeId`: `register()`
- `round`: `<Controller>` (Radix Select)
- `player1`: `register()`
- `player2`: `register()`
- `title`: `register()`

## Hybrid example

```
<form onSubmit={form.handleSubmit(onSubmit)}>
  {/* Radix Select needs Controller */}
  <Controller
    name="tournament"
    control={form.control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel>Tournament</FieldLabel>
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
          <SelectContent>{/* items */}</SelectContent>
        </Select>
        {fieldState.error && <FieldError errors={[fieldState.error]} />}
      </Field>
    )}
  />

  {/* Native input uses register */}
  <Field data-invalid={!!form.formState.errors.year}>
    <FieldLabel htmlFor="year">Year</FieldLabel>
    <Input
      id="year"
      type="number"
      {...form.register("year", { valueAsNumber: true })}
    />
    {form.formState.errors.year && (
      <FieldError errors={[form.formState.errors.year]} />
    )}
  </Field>
</form>
```

The performance benefit of `register()` comes from avoiding re-renders on every **keystroke** — but Selects don't have keystrokes, they have discrete value changes (one per user selection).

However, `register()` vs `<Controller>` isn't really a performance decision — it's a compatibility decision. You use `register()` where you **can** (native-event components), and `<Controller>` where you **must** (Radix primitives). The performance win just happens to come along with native inputs.
