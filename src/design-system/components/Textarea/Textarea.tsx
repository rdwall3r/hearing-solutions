import type { ComponentPropsWithRef } from "react";
import { Field, fieldStyles, type FieldBaseProps } from "../_field/Field";

export interface TextareaProps
  extends FieldBaseProps,
    Omit<ComponentPropsWithRef<"textarea">, "id"> {}

/** A labelled multi-line text input. Resizes vertically only. */
export function Textarea({
  label,
  hint,
  error,
  optional,
  id,
  className,
  rows = 6,
  ...textareaProps
}: TextareaProps) {
  return (
    <Field label={label} hint={hint} error={error} optional={optional} id={id} className={className}>
      {(a11y) => (
        <textarea
          className={fieldStyles.control}
          rows={rows}
          required={!optional}
          {...textareaProps}
          {...a11y}
        />
      )}
    </Field>
  );
}
