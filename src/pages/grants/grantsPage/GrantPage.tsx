import { Box, Button, Container, Image, VStack } from '@chakra-ui/react'
import { PropsWithChildren, useEffect } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { createUseStyles } from 'react-jss'
import { useNavigate, useParams } from 'react-router-dom'

import { Body1, H1, H3 } from '../../../components/typography'
import Loader from '../../../components/ui/Loader'
import { StatusLabel } from '../../../components/ui/StatusLabel'
import { Head } from '../../../config'
import { getPath } from '../../../constants'
import {
  GrantApplicant,
  GrantApplicantStatus,
  GrantStatusEnum,
  Maybe,
} from '../../../types'
import {
  getShortAmountLabel,
  useMobileMode,
  useNotification,
} from '../../../utils'
import { GrantWinnerAnnouncement } from '../components'
import { CommunityVoting } from '../components/CommunityVoting'
import { ContributionsWidget } from '../components/ContributionsWidget'
import { DistributionChart } from '../components/DistributionChart'
import { MoreInfo } from '../components/MoreInfo'
import { SectionCard } from '../components/SectionCard'
import {
  GRANT_STATUS_COUNTDOWN_TITLES,
  GRANT_STATUS_MAP,
  GrantAnnouncements,
  GrantHasVoting,
} from '../constants'
import { useGrant } from '../hooks/useGrant'
import { GrantsRoundOne } from './GrantsRoundOne'
import { GrantsRoundTwo } from './GrantsRoundTwo'
import { GrantContribute, GrantSummary } from './sections'
import { GrantApply } from './sections/GrantApply'

const PageContainer = ({
  children,
  image,
  title,
}: PropsWithChildren<{ image?: Maybe<string>; title?: string }>) => {
  return (
    <Container
      marginTop={{ base: '20px', md: '40px' }}
      maxWidth="879px"
      px={{ base: '10px', md: '20px' }}
    >
      <Head title={title} image={image || ''} />
      {children}
    </Container>
  )
}

export const GrantPage = () => {
  const { toast } = useNotification()
  const { grantId } = useParams<{ grantId: string }>()
  const isMobile = useMobileMode()
  const navigate = useNavigate()

  const { grant, loading, error } = useGrant(grantId)

  useEffect(() => {
    if (error) {
      toast({
        status: 'error',
        title: 'Something went wrongg.',
        description: 'Please refresh the page and try again.',
      })
    }
  }, [error, toast])

  if (loading || !grant) {
    return (
      <PageContainer>
        <Loader paddingTop="20px" />
      </PageContainer>
    )
  }

  const applicants: Array<GrantApplicant> =
    grant && grant.applicants
      ? (grant.applicants.filter((applicant) =>
          Boolean(
            applicant &&
              (applicant.status === GrantApplicantStatus.Accepted ||
                applicant.status === GrantApplicantStatus.Funded),
          ),
        ) as Array<GrantApplicant>)
      : []

  if (grant.name === 'grant-round-001') {
    return <GrantsRoundOne applicants={applicants} />
  }

  if (grant.name === 'grant-round-002') {
    return (
      <GrantsRoundTwo
        isLoading={loading}
        sponsors={grant.sponsors}
        applicants={applicants}
      />
    )
  }

  const canVote =
    GrantHasVoting[grant.name] && grant.status === GrantStatusEnum.FundingOpen

  const winnerAnnouncement = GrantAnnouncements[grant.name]

  const getTitle = () => {
    if (grant.status === GrantStatusEnum.Closed) {
      return 'Grant Winners!'
    }

    return ''
  }

  const showCommunityVoting = grant.status !== GrantStatusEnum.ApplicationsOpen

  return (
    <PageContainer title={grant.title} image={grant.image}>
      <VStack w="full" spacing="30px" alignItems="start">
        <Button
          size="sm"
          bg="brand.bgWhite"
          variant="outline"
          gap={2}
          onClick={() => navigate(getPath('grants'))}
          fontSize="sm"
        >
          <FaArrowLeft /> See all Grants
        </Button>
        <GrantSummary grant={grant} />
        <GrantApply />

        <GrantContribute />

        <DistributionChart applicants={applicants} />
        {winnerAnnouncement && (
          <GrantWinnerAnnouncement {...winnerAnnouncement} />
        )}
        {showCommunityVoting && (
          <CommunityVoting
            title={getTitle()}
            applicants={applicants}
            canVote={canVote}
            isClosed={grant.status === GrantStatusEnum.Closed}
          />
        )}
        <MoreInfo />
      </VStack>
    </PageContainer>
  )
}
