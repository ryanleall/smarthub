import { Options } from '@popperjs/core';
import { useState } from 'react';
import { usePopper } from 'react-popper';
import { useClickAway } from 'react-use';

// TODO: better keyboard navigation
export default function useDropdown(config: Partial<Options>) {
  const [isOpen, setIsOpen] = useState(false);
  const [toggleElement, setToggleElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const [menuElement, setMenuElement] = useState<HTMLElement | null>(null);
  useClickAway({ current: toggleElement }, () => isOpen && setIsOpen(false), [
    'click',
  ]);
  const popper = usePopper(toggleElement, menuElement, {
    ...config,
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      {
        name: 'preventOverflow',
        options: {
          altAxis: true,
          padding: 10,
        },
      },
      ...(config.modifiers || []),
    ],
  });

  const visibility: 'visible' | 'hidden' = isOpen ? 'visible' : 'hidden';

  return {
    isOpen,
    setIsOpen,
    toggleProps: {
      ref: setToggleElement,
      onClick: () => setIsOpen(!isOpen),
    },
    arrowProps: { ref: setArrowElement, style: popper.styles.arrow },
    menuProps: {
      role: 'menu',
      ref: setMenuElement,
      style: {
        ...popper.styles.popper,
        visibility,
      },
      ...popper.attributes.popper,
    },
    itemProps: { role: 'menuitem' },
  };
}
