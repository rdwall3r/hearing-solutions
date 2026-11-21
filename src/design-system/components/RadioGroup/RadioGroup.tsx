import { useId } from "react";
import { cx } from "../../utils";
import { FieldError } from "../FieldError/FieldError";
import styles from "./RadioGroup.module.css";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  /** Shared `name` for the radios (what gets submitted). */
  name: string;
  /** The question, rendered as the fieldset <legend>. */
  legend: React.ReactNode;
  options: RadioOption[];
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  /** Base id. The first radio gets this id so an error summary can link to it. */
  id?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Lay options out side by side when there's room. */
  inline?: boolean;
}

/**
 * A set of radio buttons grouped in a <fieldset> with a <legend>, so screen
 * readers announce the question along with each choice.
 */
export function RadioGroup({
  name,
  legend,
  options,
  hint,
  error,
  optional,
  id: idProp,
  value,
  defaultValue,
  onChange,
  inline,
}: RadioGroupProps) {
  const generated = useId();
  const id = idProp ?? generated;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <fieldset
      className={cx(styles.group, error ? styles.invalid : undefined)}
      aria-describedby={cx(hintId, errorId) || undefined}
    >
      <legend className={styles.legend}>
        {legend}
        {optional && <span className={styles.optional}> (optional)</span>}
      </legend>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && <FieldError id={errorId!}>{error}</FieldError>}
      <div className={cx(styles.options, inline ? styles.inline : undefined)}>
        {options.map((option, index) => {
          const optionId = index === 0 ? id : `${id}-${option.value}`;
          return (
            <div className={styles.option} key={option.value}>
              <input
                className={styles.radio}
                type="radio"
                id={optionId}
                name={name}
                value={option.value}
                required={!optional}
                {...(value !== undefined
                  ? { checked: value === option.value, onChange: () => onChange?.(option.value) }
                  : {
                      defaultChecked: defaultValue === option.value,
                      onChange: () => onChange?.(option.value),
                    })}
              />
              <label htmlFor={optionId}>{option.label}</label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
