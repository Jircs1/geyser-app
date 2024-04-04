import { Box, VStack } from '@chakra-ui/react'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'

import { MobileViews, useProjectContext } from '../../modules/project/context'
import { fadeOut, slideInLeft } from '../../styles'
import { useMobileMode } from '../../utils'
import { useEntryAtom } from './entryAtom'
import { EntryDetails } from './EntryDetails'

type Rules = string

interface IStyles {
  isMobile?: boolean
  inView: boolean
  fadeStarted?: boolean
}

const useStyles = createUseStyles<Rules, IStyles>({
  container: ({ isMobile, inView, fadeStarted }: IStyles) => ({
    display: !isMobile || inView || fadeStarted ? 'flex' : 'none',
    position: fadeStarted ? 'absolute' : 'relative',
    top: fadeStarted ? 0 : undefined,
    left: fadeStarted ? 0 : undefined,
  }),
  twitter: {
    maxWidth: 450,
    '.twitter-widget-0': {
      width: '200px !important',
    },
  },
  aboutText: {
    width: '100%',
    fontSize: '14px',
  },
  detailsContainer: () => ({
    height: '100%',
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
    display: 'flex',
    flexDirection: 'column',
  }),
  ...slideInLeft,
  ...fadeOut,
})

export const EntryContainer = () => {
  const isMobile = useMobileMode()

  const [entry] = useEntryAtom()

  const { mobileView } = useProjectContext()

  const inView = mobileView === MobileViews.description

  const classes = useStyles({ isMobile, inView })

  return (
    <Box
      className={classNames(classes.container)}
      backgroundColor={'neutral.0'}
      flex={!isMobile ? 3 : undefined}
      height="100%"
      w="100%"
      flexDirection="column"
      overflow="hidden"
    >
      <Box className={classes.detailsContainer} id="project-scroll-container">
        <VStack alignItems="center" width="100%" flex="1">
          <VStack
            spacing="20px"
            alignItems="left"
            marginTop={'20px'}
            width={'full'}
            maxWidth="1000px"
            height={'full'}
            padding={isMobile ? '0px 10px 50px 10px' : '0px 40px 70px 40px'}
          >
            <EntryDetails entry={entry} />
          </VStack>
        </VStack>
      </Box>
    </Box>
  )
}
