import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import styles from './Subheading.module.css';

export interface SubheadingProps {
  children: ReactNode;
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
export function Subheading({ children, as: Tag = 'p', className }: SubheadingProps) {
  return <Tag className={clsx(styles.subheading, className)}>{children}</Tag>;
}
