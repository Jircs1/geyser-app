import { useQuery } from '@apollo/client'
import { Box, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { CardLayout } from '../../../../components/layouts'
import { H2, H3 } from '../../../../components/typography'
import { ImageWithReload } from '../../../../components/ui'
import Loader from '../../../../components/ui/Loader'
import { getPath } from '../../../../constants'
import { Project, UniqueProjectQueryInput } from '../../../../types'
import { AvatarElement } from '../../../projectView/projectMainBody/components'
import { QUERY_FEATURED_PROJECT_FOR_LANDING_PAGE } from '../../projects.graphql'
import { ProjectFundingStatWithFollow } from './ProjectFundingStatWithFollow'
import { ProjectRowLayout } from './ProjectRowLayout'

export const FeaturedProjectCard = ({
  projectName,
}: {
  projectName: string
}) => {
  const { data, loading } = useQuery<
    { project: Project },
    { where: UniqueProjectQueryInput }
  >(QUERY_FEATURED_PROJECT_FOR_LANDING_PAGE, {
    variables: {
      where: {
        name: projectName,
      },
    },
  })

  const project = data?.project

  if (!project || loading) {
    return <Loader />
  }

  return (
    <ProjectRowLayout title="Featured Project" width="100%">
      <CardLayout
        noborder
        hover
        direction={{ base: 'column', sm: 'row' }}
        width="100%"
        height={{ base: 'auto', sm: '245px' }}
        alignItems="start"
        spacing="20px"
        padding="0px"
        as={Link}
        to={getPath('project', projectName)}
      >
        <Box
          width={{ base: '100%', sm: '55%' }}
          height={{ base: '240px', sm: '100%' }}
          borderTopRightRadius="8px"
          borderBottomRightRadius="8px"
          overflow="hidden"
        >
          <ImageWithReload
            height="full"
            width="full"
            src={`${project.thumbnailImage}`}
            objectFit="cover"
          />
        </Box>
        <VStack
          width={{ base: '100%', sm: '45%' }}
          height="100%"
          minWidth="200px"
          alignItems="start"
          justifyContent="start"
          spacing="10px"
          overflow="hidden"
        >
          <H2 color="brand.neutral700"> {project.title} </H2>
          <AvatarElement noLink rounded="full" user={project.owners[0].user} />
          <H3 color="brand.neutral800" isTruncated whiteSpace="normal">
            {project.shortDescription}
          </H3>
          <ProjectFundingStatWithFollow
            flex={1}
            pb={1}
            align={'flex-end'}
            justifyContent={'space-between'}
            project={project}
            bold
          />
        </VStack>
      </CardLayout>
    </ProjectRowLayout>
  )
}
