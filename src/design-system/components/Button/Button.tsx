import type { ComponentPropsWithRef } from "react";
import { clsx } from "clsx";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "accent";

/** "small" is for compact spots like the header menu button. It still meets
    the 44px touch-target size. */
export type ButtonSize = "default" | "small";

export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "default",
) {
  return clsx(styles.button, styles[variant], size === "small" && styles.small);
}

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * A real <button>. Use it for actions (submitting a form, toggling something).
 * For navigation, use <Link variant="button"> instead so it stays a link.
 */
export function Button({
  variant = "primary",
  size = "default",
  type = "button",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(buttonClassName(variant, size), className)}
      {...rest}
    />
  );
}
