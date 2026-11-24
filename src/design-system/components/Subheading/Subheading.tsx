import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import styles from './Subheading.module.css';

/**
 * Named colors only, so every option's contrast is checked in both themes
 * (scripts/check-contrast.mjs):
 * - "text": the normal text color (ink black; newsprint in dark mode)
 * - "service": sage green, for anything about local, in-person services
 */
export type SubheadingColor = 'text' | 'service';

export interface SubheadingProps {
  children: ReactNode;
  /** Defaults to "text". */
  color?: SubheadingColor;
  /**
   * The element to render. Never a heading element: a subheading describes
   * the heading above it and must stay out of the document outline.
   */
  as?: 'p' | 'span' | 'div';
  className?: string;
}

/**
 * A small uppercase line under a heading, e.g. "By appointment, in person".
 *
 * Write the text in normal case: the uppercase is CSS only, so screen
 * readers read words rather than spelling out letters.
 *
 * Deliberately plain: no border, background or hover state, so it can't be
 * mistaken for a button or link.
 */
export function Subheading({
  children,
  color = 'text',
  as: Tag = 'p',
  className,
}: SubheadingProps) {
  return (
    <Tag className={clsx(styles.subheading, styles[color], className)}>
      {children}
    </Tag>
  );
}
