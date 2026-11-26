/** The fixed header's height (--header-h), for scroll offsets. */
export const headerHeight = () =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
