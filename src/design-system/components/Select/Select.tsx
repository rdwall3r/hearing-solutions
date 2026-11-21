import type { ComponentPropsWithRef } from "react";
import { Field, fieldStyles, type FieldBaseProps } from "../_field/Field";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends FieldBaseProps,
    Omit<ComponentPropsWithRef<"select">, "id"> {
  options: SelectOption[];
  /** Optional first option with an empty value, e.g. "Choose one". */
  emptyOption?: string;
}

/** A labelled native <select>. Native keeps keyboard and screen reader support. */
export function Select({
  label,
  hint,
  error,
  optional,
  id,
  className,
  options,
  emptyOption,
  ...selectProps
}: SelectProps) {
  return (
    <Field label={label} hint={hint} error={error} optional={optional} id={id} className={className}>
      {(a11y) => (
        <select className={fieldStyles.control} required={!optional} {...selectProps} {...a11y}>
          {emptyOption !== undefined && <option value="">{emptyOption}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}
