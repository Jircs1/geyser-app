import { Box, Button, HStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { Link, matchPath, matchRoutes, useLocation } from 'react-router-dom'

import { routerPathNames } from '../../../constants'
import { colors } from '../../../styles'
import { GrantsNavIcon, HomeNavIcon, ProjectNavIcon } from '../../icons'

const routesForShowingLandingMenu = [
  `/`,
  `/${routerPathNames.discover}`,
  `/${routerPathNames.grants}`,
  `/${routerPathNames.grants}/roundone`,
  `/${routerPathNames.grants}/roundtwo`,
]

const LandingNavItems = [
  {
    name: 'Home',
    Icon: HomeNavIcon,
    path: '/',
  },
  {
    name: 'Projects',
    Icon: ProjectNavIcon,
    path: '/discover',
  },
  {
    name: 'Grants',
    Icon: GrantsNavIcon,
    path: '/grants',
  },
]

export const LandingNavBar = () => {
  const location = useLocation()

  const routeMatchesForShowingLandingMenu = matchRoutes(
    routesForShowingLandingMenu.map((val) => ({ path: val })),
    location,
  )

  const shouldShowLandingNav = useMemo(
    () =>
      routeMatchesForShowingLandingMenu?.some((routeMatch) =>
        Boolean(routeMatch),
      ),
    [routeMatchesForShowingLandingMenu],
  )

  const handleScrollUp = (path: string) => {
    const currentRoute = routeMatchesForShowingLandingMenu?.find((routeMatch) =>
      Boolean(routeMatch),
    )

    if (currentRoute?.pathname === path) {
      document.scrollingElement?.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.scrollingElement?.scrollTo({ top: 0 })
    }
  }

  if (shouldShowLandingNav) {
    return (
      <>
        <Box height="60px" width="100%"></Box>
        <HStack
          backgroundColor="brand.neutral50"
          width="100%"
          height="60px"
          borderTop="2px solid"
          borderTopColor="brand.neutral200"
          paddingX="15%"
          justifyContent="center"
          alignItems="center"
          spacing="25%"
          position="fixed"
          bottom="0px"
          paddingBottom="2px"
        >
          {LandingNavItems.map(({ name, path, Icon }) => {
            const isActive = Boolean(matchPath(path, location.pathname))
            return (
              <Button
                as={Link}
                to={path}
                key={name}
                variant="ghost"
                onClick={() => handleScrollUp(path)}
                _hover={{}}
                _focus={{}}
              >
                <Icon
                  boxSize={8}
                  color={isActive ? 'black' : colors.neutral500}
                />
              </Button>
            )
          })}
        </HStack>
      </>
    )
  }

  return null
}
