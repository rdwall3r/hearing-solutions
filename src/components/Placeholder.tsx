import styles from "./Placeholder.module.css";

/**
 * Marks copy Ryan still needs to write. Renders visibly (dashed box) so it's
 * impossible to miss before launch. Search the codebase for "TODO(copy)".
 *
 *   <Placeholder>intro paragraph about the shop</Placeholder>
 *   → TODO(copy): intro paragraph about the shop
 */
export function Placeholder({
  children,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  as?: "p" | "span";
}) {
  return (
    <Tag className={styles.placeholder} data-todo="copy">
      TODO(copy): {children}
    </Tag>
  );
}
