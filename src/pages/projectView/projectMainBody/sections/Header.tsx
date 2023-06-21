import { Box, HStack, Text, VStack, Wrap } from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { forwardRef } from 'react'
import { AiOutlineCalendar } from 'react-icons/ai'
import { FiTag } from 'react-icons/fi'
import { SlLocationPin } from 'react-icons/sl'
import { Link } from 'react-router-dom'

import { CardLayout } from '../../../../components/layouts'
import { ImageWithReload, ProjectStatusLabel } from '../../../../components/ui'
import { DefaultImage } from '../../../../components/ui/DefaultImage'
import { VideoPlayer } from '../../../../components/ui/VideoPlayer'
import { getPath } from '../../../../constants'
import { SortType, useProjectContext } from '../../../../context'
import { validateImageUrl } from '../../../../forms/validations/image'
import { useMobileMode } from '../../../../utils'
import {
  FollowButton,
  LightningAddress,
  ProjectFundingQR,
  ProjectLinks,
  ProjectMenu,
  SummaryInfoLine,
  TagBox,
} from '../components'

export const Header = forwardRef<HTMLDivElement>((_, ref) => {
  const isMobile = useMobileMode()
  const { project, isProjectOwner } = useProjectContext()

  if (!project) {
    return null
  }

  const statusContent = (
    <HStack>
      <ProjectStatusLabel project={project} />
      {isProjectOwner && <ProjectMenu projectName={project.name} />}
    </HStack>
  )

  const renderImageOrVideo = () => {
    const isImage = validateImageUrl(project.image)

    if (isImage) {
      return (
        <ImageWithReload
          width="100%"
          maxHeight="350px"
          objectFit="cover"
          borderRadius="8px"
          src={project.image || undefined}
        />
      )
    }

    if (project.image && !isImage) {
      return <VideoPlayer url={project.image} />
    }

    return (
      <DefaultImage
        width="100%"
        maxHeight="350px"
        objectFit="cover"
        borderRadius="8px"
      />
    )
  }

  return (
    <CardLayout ref={ref}>
      <Box>{renderImageOrVideo()}</Box>

      <HStack flexGrow={1} width="100%" spacing={3} alignItems="start">
        <ImageWithReload
          borderRadius="8px"
          objectFit="cover"
          src={project.thumbnailImage || undefined}
          width="80px"
          height="80px"
          maxHeight="80px"
          boxShadow="lg"
        />
        <VStack
          flexGrow={1}
          alignItems="start"
          maxWidth="calc(100% - 76px - 24px)"
        >
          <Text variant={{ base: 'h2', xl: 'h1' }} noOfLines={2} width="100%">
            {project.title}
          </Text>
          {isMobile ? (
            statusContent
          ) : (
            <HStack width="100%" flexWrap="wrap">
              <HStack flexGrow={1} flexWrap="wrap">
                <FollowButton projectId={project.id} />
                <LightningAddress name={`${project.name}@geyser.fund`} />
                <ProjectFundingQR project={project} />
              </HStack>
              {statusContent}
            </HStack>
          )}
        </VStack>
      </HStack>

      {isMobile ? (
        <HStack flexGrow={1}>
          <Box flexGrow={1}>
            <FollowButton projectId={project.id} />
          </Box>
          <LightningAddress name={`${project.name}@geyser.fund`} />
          <ProjectFundingQR project={project} />
        </HStack>
      ) : null}

      <Text variant={{ base: 'h3', xl: 'h2' }}>{project.shortDescription}</Text>

      {project.tags?.length > 0 && (
        <SummaryInfoLine
          label="Tags"
          icon={
            <span>
              <FiTag color="neutral.600" />
            </span>
          }
        >
          <Wrap>
            {project.tags.map((tag) => {
              return (
                <Link
                  key={tag.id}
                  to={getPath('landingPage')}
                  state={{
                    filter: { tagIds: [tag.id], sort: SortType.balance },
                  }}
                >
                  <TagBox>{tag.label}</TagBox>
                </Link>
              )
            })}
          </Wrap>
        </SummaryInfoLine>
      )}

      {(project.location?.country?.name || project.location?.region) && (
        <SummaryInfoLine
          label="Region"
          icon={
            <span>
              <SlLocationPin color="neutral.600" />
            </span>
          }
        >
          <Wrap spacing="5px">
            {project?.location?.country?.name &&
              project.location.country.name !== 'Online' && (
                <Link
                  key={project?.location?.country?.name}
                  to={getPath('landingPage')}
                  state={{
                    filter: {
                      countryCode: project?.location?.country?.code,
                      sort: SortType.balance,
                    },
                  }}
                >
                  <TagBox>{project?.location?.country?.name}</TagBox>
                </Link>
              )}
            {project?.location?.region && (
              <Link
                key={project?.location?.region}
                to={getPath('landingPage')}
                state={{
                  filter: {
                    region: project?.location?.region,
                    sort: SortType.balance,
                  },
                }}
              >
                <TagBox>{project?.location?.region}</TagBox>
              </Link>
            )}
          </Wrap>
        </SummaryInfoLine>
      )}

      <HStack>
        <ProjectLinks links={project.links as string[]} />
        <SummaryInfoLine
          label="Launched"
          icon={
            <span>
              <AiOutlineCalendar color="neutral.600" />
            </span>
          }
        >
          <Text
            variant="body2"
            color="neutral.600"
          >{`Launched ${DateTime.fromMillis(Number(project.createdAt)).toFormat(
            'dd LLL yyyy',
          )}`}</Text>
        </SummaryInfoLine>
      </HStack>
    </CardLayout>
  )
})