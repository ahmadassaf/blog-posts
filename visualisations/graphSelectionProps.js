/** Shared pointer and keyboard selection for focusable SVG graph elements. */
export const graphSelectionProps = ({ label, selected, onSelect }) => {
  return {
    'aria-label': label,
    'aria-pressed': selected,
    'data-active': selected,
    'onClick': onSelect,
    'onFocus': onSelect,
    'onKeyDown': (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect();
      }
    },
    'role': 'button',
    'tabIndex': 0
  };
};
