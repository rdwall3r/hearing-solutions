import type { ComponentPropsWithRef } from "react";
import { Field, fieldStyles, type FieldBaseProps } from "../_field/Field";

export interface TextFieldProps
  extends FieldBaseProps,
    Omit<ComponentPropsWithRef<"input">, "id"> {
  type?: "text" | "email" | "tel" | "url" | "search";
}

/** A labelled single-line text input with optional hint and error. */
export function TextField({
  label,
  hint,
  error,
  optional,
  id,
  className,
  type = "text",
  ...inputProps
}: TextFieldProps) {
  return (
    <Field label={label} hint={hint} error={error} optional={optional} id={id} className={className}>
      {(a11y) => (
        <input
          type={type}
          className={fieldStyles.control}
          required={!optional}
          {...inputProps}
          {...a11y}
        />
      )}
    </Field>
  );
}
