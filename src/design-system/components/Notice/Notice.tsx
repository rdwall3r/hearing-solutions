import type { ComponentPropsWithRef } from "react";
import { clsx } from "clsx";
import styles from "./Notice.module.css";

export type NoticeTone = "info" | "success" | "warning" | "error";

const TONE_LABEL: Record<NoticeTone, string> = {
  info: "Note",
  success: "Success",
  warning: "Important",
  error: "Error",
};

export interface NoticeProps extends Omit<ComponentPropsWithRef<"div">, "title"> {
  tone?: NoticeTone;
  /** Optional heading. Pick the level that fits the page outline. */
  title?: React.ReactNode;
  headingLevel?: 2 | 3 | 4;
}

/**
 * A boxed message: regulatory notes, form error summaries, confirmations.
 *
 * Notice doesn't announce itself. When one appears after a user action (an
 * error summary or a confirmation), move focus to it: give it tabIndex={-1}
 * and call .focus(). That's more reliable across screen readers than live
 * regions, and it also scrolls the message into view.
 */
export function Notice({
  tone = "info",
  title,
  headingLevel = 2,
  className,
  children,
  ...rest
}: NoticeProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div className={clsx(styles.notice, styles[tone], className)} {...rest}>
      {title ? (
        <Heading className={styles.title}>
          <span className="visually-hidden">{TONE_LABEL[tone]}: </span>
          {title}
        </Heading>
      ) : null}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
