import { Options } from '@popperjs/core';
import React, { ComponentProps, HTMLProps, useContext } from 'react';
import { Link } from 'react-router-dom';

import useDropdown from 'app/hooks/useDropdown';

import styles from './styles.module.css';

const DropdownContext = React.createContext<{
  arrow: boolean;
  dropdown: ReturnType<typeof useDropdown>;
} | null>(null);

interface DropdownWrapperProps {
  /** Whether to display an arrow */
  arrow: boolean;
  /** The options to pass to Popper.js */
  popperOptions?: Partial<Options>;
}
const DropdownWrapper: React.FC<DropdownWrapperProps> = function ({
  children,
  arrow,
  popperOptions = {},
}) {
  const dropdown = useDropdown({
    modifiers: [
      { name: 'offset', options: { offset: [0, 14] } },
      ...(popperOptions?.modifiers || []),
    ],
    ...popperOptions,
  });

  return (
    <DropdownContext.Provider value={{ arrow, dropdown }}>
      {children}
    </DropdownContext.Provider>
  );
};

const DropdownToggle: React.FC = function ({ children }) {
  const ctx = useContext(DropdownContext);
  if (!ctx) return null;

  return <div {...ctx.dropdown.toggleProps}>{children}</div>;
};

const DropdownMenu: React.FC = function ({ children }) {
  const ctx = useContext(DropdownContext);
  if (!ctx) return null;

  return (
    <div {...ctx.dropdown.menuProps}>
      {ctx.arrow ? (
        <div {...ctx.dropdown.arrowProps} className={styles.arrow} />
      ) : null}
      <div className={styles.menuContents}>{children}</div>
    </div>
  );
};

const DropdownItem: React.FC<HTMLProps<HTMLDivElement>> = function ({
  className,
  onClick,
  ...args
}) {
  const ctx = useContext(DropdownContext);
  if (!ctx) return null;
  const { dropdown } = ctx;

  return (
    <div
      onClick={(...args) => {
        dropdown.setIsOpen(false);
        if (onClick) onClick(...args);
      }}
      className={[className, styles.item].join(' ')}
      role="menuitem"
      {...args}
    />
  );
};

const DropdownItemLink: React.FC<ComponentProps<typeof Link>> = function ({
  className,
  onClick,
  ...args
}) {
  const ctx = useContext(DropdownContext);
  if (!ctx) return null;
  const { dropdown } = ctx;

  return (
    <Link
      onClick={(...args) => {
        dropdown.setIsOpen(false);
        if (onClick) onClick(...args);
      }}
      className={[className, styles.item].join(' ')}
      role="menuitem"
      {...args}
    />
  );
};

export {
  DropdownWrapper as Wrapper,
  DropdownToggle as Toggle,
  DropdownMenu as Menu,
  DropdownItem as Item,
  DropdownItemLink as ItemLink,
};
