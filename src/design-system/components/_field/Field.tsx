import { useId } from "react";
import { cx } from "../../utils";
import { FieldError } from "../FieldError/FieldError";
import styles from "./Field.module.css";

export interface FieldBaseProps {
  /** Visible label. Every control has one. Placeholders are never a substitute. */
  label: React.ReactNode;
  /** Optional help text shown between the label and the control. */
  hint?: React.ReactNode;
  /** Error message. When set, the control is marked aria-invalid. */
  error?: React.ReactNode;
  /** Shows "(optional)" after the label. Required is the default. */
  optional?: boolean;
  /** Override the generated id (e.g. so an error summary can link to it). */
  id?: string;
}

interface ControlA11yProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
}

/**
 * Internal layout shared by TextField, Select and Textarea: label → hint →
 * control → error, with the ids and ARIA wired up once in one place.
 */
export function Field({
  label,
  hint,
  error,
  optional,
  id: idProp,
  className,
  children,
}: FieldBaseProps & {
  className?: string;
  children: (a11y: ControlA11yProps) => React.ReactNode;
}) {
  const generated = useId();
  const id = idProp ?? generated;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = cx(hintId, errorId) || undefined;

  return (
    <div className={cx(styles.field, error ? styles.invalid : undefined, className)}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {optional && <span className={styles.optional}> (optional)</span>}
      </label>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}
      {error && <FieldError id={errorId!}>{error}</FieldError>}
    </div>
  );
}

export { styles as fieldStyles };
