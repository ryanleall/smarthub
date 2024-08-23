import { uniqueId } from 'lodash-es';
import React, { Suspense, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { useIntersection } from 'react-use';

import SearchIcon from 'app/assets/icons/search.svg?react';
import Logo from 'app/assets/logo.svg?react';
import ModalLink from 'app/components/ModalLink';
import Spinner from 'app/components/feedback/Spinner';
import { useSession } from 'app/contexts/SessionContext';
import utilStyles from 'app/styles/utils.module.css';

import AvatarMenu from './AvatarMenu';
import styles from './styles.module.css';

export type HeaderBackground = 'opaque' | 'transparent';

export type HeaderProps = {
  background?: HeaderBackground;
  scrollBackground?: HeaderBackground;
};

export default function Header({
  background = 'opaque',
  scrollBackground = 'opaque',
}: HeaderProps): JSX.Element {
  // We don't expect to have this multiple times per page but we should still be careful
  const [searchId] = useState(() => uniqueId('header-search-'));
  const { session } = useSession();
  const intersectionRef = React.useRef(null);
  const intersection = useIntersection(intersectionRef, { threshold: 0 });
  const isScrolled = !intersection?.isIntersecting;
  const displayBackground = isScrolled ? scrollBackground : background;
  const { formatMessage } = useIntl();

  return (
    <>
      <div className={styles.headerScrollMonitor} ref={intersectionRef} />
      <header className={[styles.header, styles[displayBackground]].join(' ')}>
        <nav
          className={[
            utilStyles.container,
            session ? styles.loggedIn : null,
            styles.container,
          ].join(' ')}>
          <NavLink to="/" className={styles.logo}>
            <Logo />
          </NavLink>
          <ul className={styles.navList}>
            <li>
              <NavLink to="#">
                <FormattedMessage
                  id="header.library"
                  defaultMessage="Library"
                  description="Link in header to view your own library"
                />
              </NavLink>
            </li>
            <li>
              <NavLink to="#">
                <FormattedMessage
                  id="header.browse"
                  defaultMessage="Browse"
                  description="Dropdown in header to browse media"
                />
              </NavLink>
            </li>
            <li>
              <NavLink to="#">
                <FormattedMessage
                  id="header.groups"
                  defaultMessage="Groups"
                  description="Link in header to explore groups"
                />
              </NavLink>
            </li>
            <li>
              <NavLink to="#">
                <FormattedMessage
                  id="header.feedback"
                  defaultMessage="Feedback"
                  description="Dropdown in header to provide feedback about Kitsu"
                />
              </NavLink>
            </li>
          </ul>
          <div className={styles.search}>
            <label htmlFor={searchId}>
              <SearchIcon className={styles.icon} />
            </label>
            <input
              type="search"
              placeholder={formatMessage({
                id: 'components.application.nav-search',
                defaultMessage: 'Search Kitsu',
                description: 'Placeholder text for search field',
              })}
              id={searchId}
            />
          </div>
          {session ? (
            <>
              <Suspense fallback={<Spinner />}>
                <a
                  className={[styles.circular, styles.notificationCount].join(
                    ' '
                  )}>
                  3
                </a>
                <AvatarMenu className={styles.avatar} />
              </Suspense>
            </>
          ) : (
            <div className={styles.authCta}>
              <ModalLink to="/auth/sign-up">
                <FormattedMessage
                  id="header.auth.sign-up"
                  defaultMessage="Sign Up"
                  description="Link in header to create an account"
                />
              </ModalLink>
              {' or '}
              <ModalLink to="/auth/sign-in">
                <FormattedMessage
                  id="header.auth.sign-in"
                  defaultMessage="Sign In"
                  description="Link in header to sign in"
                />
              </ModalLink>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
