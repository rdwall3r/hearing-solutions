import type { ComponentPropsWithRef } from "react";
import { cx } from "../../utils";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "accent";

export function buttonClassName(variant: ButtonVariant = "primary") {
  return cx(styles.button, styles[variant]);
}

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: ButtonVariant;
}

/**
 * A real <button>. Use it for actions (submitting a form, toggling something).
 * For navigation, use <Link variant="button"> instead so it stays a link.
 */
export function Button({
  variant = "primary",
  type = "button",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(buttonClassName(variant), className)}
      {...rest}
    />
  );
}
