import type { ComponentPropsWithRef } from "react";
import { Link as RouterLink, type LinkProps as RouterLinkProps } from "react-router";
import { cx } from "../../utils";
import { buttonClassName } from "../Button/Button";

type Variant = "inline" | "button" | "button-secondary";

function variantClass(variant: Variant) {
  if (variant === "button") return buttonClassName("primary");
  if (variant === "button-secondary") return buttonClassName("secondary");
  return undefined; // inline links use the global <a> styles from base.css
}

type InternalProps = RouterLinkProps & { variant?: Variant; href?: never };
type ExternalProps = ComponentPropsWithRef<"a"> & {
  variant?: Variant;
  href: string;
  to?: never;
};
export type LinkProps = InternalProps | ExternalProps;

/**
 * Navigation. Pass `to` for pages on this site (client-side routing) or
 * `href` for anything else (other sites, mailto:, tel:).
 * `variant="button"` makes a link look like a button while keeping link
 * semantics. It still goes somewhere and doesn't perform an action.
 */
export function Link(props: LinkProps) {
  const { variant = "inline", className, ...rest } = props;
  const classes = cx(variantClass(variant), className as string | undefined);

  if ("href" in rest && rest.href !== undefined) {
    return <a className={classes || undefined} {...(rest as ComponentPropsWithRef<"a">)} />;
  }
  return <RouterLink className={classes || undefined} {...(rest as RouterLinkProps)} />;
}
