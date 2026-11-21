/**
 * Story helper: focuses an element after render so "Focus" stories show the
 * focus ring. `focusVisible: true` asks the browser to draw the ring as if
 * the element had been reached by keyboard.
 */
export function focusOn(selector: string) {
  return async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const el = canvasElement.querySelector<HTMLElement>(selector);
    el?.focus({ focusVisible: true } as FocusOptions);
  };
}
