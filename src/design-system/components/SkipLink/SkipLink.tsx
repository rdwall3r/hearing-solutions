import styles from "./SkipLink.module.css";

export interface SkipLinkProps {
  /** id of the element to skip to (without the #). */
  targetId?: string;
  children?: React.ReactNode;
}

/**
 * The first focusable thing on every page. Hidden until focused, then it
 * appears in the top corner so keyboard users can jump past the navigation.
 */
export function SkipLink({ targetId = "main", children = "Skip to main content" }: SkipLinkProps) {
  return (
    <a className={styles.skipLink} href={`#${targetId}`}>
      {children}
    </a>
  );
}
