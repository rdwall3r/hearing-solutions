import { clsx } from "clsx";
import styles from "./FieldError.module.css";

export interface FieldErrorProps {
  /** Referenced by the control's aria-describedby. */
  id: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * The error message under a form control. The word "Error:" is part of the
 * visible text so the message never relies on color alone.
 */
export function FieldError({ id, children, className }: FieldErrorProps) {
  return (
    <p id={id} className={clsx(styles.error, className)}>
      <span className={styles.label}>Error:</span> {children}
    </p>
  );
}
