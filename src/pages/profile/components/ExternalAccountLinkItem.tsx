import React, { useMemo, ReactElement } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import {
  Button,
  Link,
  ThemeComponentProps,
  ThemeTypings,
} from '@chakra-ui/react';
import { ExternalAccount } from '../../../types/generated/graphql';
import { colors, GeyserHomepageUrl } from '../../../constants';
import { BsTwitter } from 'react-icons/bs';
import { FountainIcon } from '../../../components/icons';
import { createUseStyles } from 'react-jss';

type Props = {
  account: ExternalAccount;
};

const useStyles = createUseStyles({
  linkContainer: {
    color: colors.textBlack,
  },
  linkButton: {
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
  },
});

export const ExternalAccountLinkItem = ({ account }: Props) => {
  const { type, externalUsername } = account;
  const styles = useStyles();

  const linkDestination: string = useMemo(() => {
    switch (type) {
      case 'twitter':
        return `https://twitter.com/${externalUsername}`;
      case 'Fountain':
        return `https://www.fountain.fm/${account.externalUsername}`;
      default:
        return `${GeyserHomepageUrl}`;
    }
  }, [type, externalUsername]);

  const isLinkExternal: boolean = useMemo(() => {
    switch (type) {
      case 'twitter':
        return true;
      case 'Fountain':
        return true;
      default:
        return false;
    }
  }, [type]);

  const buttonIcon: ReactElement = useMemo(() => {
    switch (type) {
      case 'twitter':
        return <BsTwitter />;
      case 'Fountain':
        return <FountainIcon />;
      default:
        return <></>;
    }
  }, [type]);

  const buttonVariant: ThemeComponentProps['variant'] = useMemo(() => {
    switch (type) {
      case 'twitter':
        return 'solid';
      case 'Fountain':
        return 'ghost';
      default:
        return 'ghost';
    }
  }, [type]);

  const buttonColorScheme: ThemeTypings['colorSchemes'] | '' = useMemo(() => {
    switch (type) {
      case 'twitter':
        return 'twitter';
      case 'Fountain':
        return '';
      default:
        return '';
    }
  }, [type]);

  return isLinkExternal ? (
    <Link href={linkDestination} isExternal className={styles.linkContainer}>
      <Button
        leftIcon={buttonIcon}
        colorScheme={buttonColorScheme}
        variant={buttonVariant}
        className={styles.linkButton}
      >
        {account.externalUsername}
      </Button>
    </Link>
  ) : (
    <Link
      as={ReactRouterLink}
      to={linkDestination}
      className={styles.linkContainer}
    >
      <Button
        leftIcon={buttonIcon}
        colorScheme={buttonColorScheme}
        variant={buttonVariant}
        className={styles.linkButton}
      >
        {account.externalUsername}
      </Button>
    </Link>
  );
};