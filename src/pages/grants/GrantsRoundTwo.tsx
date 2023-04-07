import {
  Box,
  Button,
  Image,
  Link,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { RiLinksLine, RiLinkUnlinkM } from 'react-icons/ri'
import { useNavigate } from 'react-router'

import satsymbol from '../../assets/satsymbolprimary.svg'
import { AppFooter } from '../../components/molecules'
import { ButtonComponent } from '../../components/ui'
import { GrantsRound2Url } from '../../constants'
import { fonts } from '../../styles'
import { GrantApplicant, Maybe, Sponsor } from '../../types'
import { useMobileMode } from '../../utils'
import { BoardMembers } from './components/BoardMembers'
import { CommunityVoting } from './components/CommunityVoting'
import { GrantDevelopers } from './components/GrantDevs'
import { GrantsContributeModal } from './components/GrantsContributeModal'
import { MoreInfo } from './components/MoreInfo'

export type GrantSponsor = {
  name: string
  amount: number
  imageUrl: string
}

export const GrantsRoundTwo = ({
  isLoading,
  sponsors,
  applicants,
}: {
  isLoading: boolean
  applicants?: GrantApplicant[]
  sponsors?: Maybe<Sponsor>[]
}) => {
  const isMobile = useMobileMode()
  const navigate = useNavigate()

  const [copy, setCopy] = useState(false)

  const handleCopyOnchain = () => {
    navigator.clipboard.writeText('grants@geyser.fund')
    setCopy(true)
    setTimeout(() => {
      setCopy(false)
    }, 1000)
  }

  return (
    <>
      <Box
        paddingTop={isMobile ? '10px' : '20px'}
        bg={'brand.bgGrey4'}
        minHeight="100vh"
        display="flex"
        alignItems={'center'}
        flexDirection="column"
      >
        <Box
          my={4}
          width={isMobile ? '100%' : '909px'}
          px={isMobile ? '1rem' : ''}
          paddingBottom="20px"
          position="relative"
        >
          <Button
            size={'sm'}
            bg="brand.bgWhite"
            variant={'outline'}
            gap={2}
            onClick={() => navigate(-1)}
            fontSize="sm"
            position={isMobile ? 'relative' : 'absolute'}
          >
            <FaArrowLeft /> See all Grants
          </Button>
          <Box display="flex" justifyContent={'center'}>
            <Image height={'220px'} src={GrantsRound2Url} />
          </Box>
          <Box
            display="flex"
            alignItems={'center'}
            justifyContent="center"
            my={1}
            gap={4}
          >
            <Text
              bg="brand.primary100"
              fontSize={'10px'}
              px="14px"
              py={'5px'}
              fontWeight="500"
            >
              ACTIVE
            </Text>
          </Box>
          <Text
            fontSize={isMobile ? '15px' : '16px'}
            fontWeight="500"
            color={'brand.neutral600'}
            textAlign="center"
            justifyContent="center"
          >
            Funding educators, creatives and builders doing Bitcoin-only
            projects on Geyser.{isMobile ? '' : <br />} Funded by bitcoin
            sponsors who want to change the world for the better.
          </Text>
          <Box display="flex" flexDirection={'column'} alignItems="center">
            <Box color={'brand.primary500'} my={8}>
              <Box
                display={'flex'}
                alignItems="center"
                justifyContent={'center'}
              >
                <Box mr={1}>
                  <img src={satsymbol} width="30px" alt="satsymbol" />
                </Box>

                <Text
                  fontWeight={'700'}
                  fontSize={'36px'}
                  fontFamily={fonts.livvic}
                  textAlign="center"
                >
                  100 M
                </Text>
                <Text
                  fontSize={'xs'}
                  ml="1"
                  fontWeight="800"
                  color="brand.neutral400"
                >
                  <small>($20K)</small>
                </Text>
              </Box>
              <Text fontWeight={'400'} fontFamily={fonts.inter} fontSize="17px">
                GRANT TO DISTRIBUTE
              </Text>
            </Box>

            <Box
              minWidth={'100%'}
              borderRadius="12px"
              rounded="md"
              overflow="hidden"
            >
              <img
                src={
                  'https://storage.googleapis.com/geyser-images-distribution-prod-us/geyser-proposal-x3%20copy.jpg'
                }
              />
            </Box>
            {applicants && Boolean(applicants.length) && (
              <Box my={5}>
                <CommunityVoting
                  title="Grant Winners"
                  applicants={applicants}
                  canVote={false}
                  isClosed={true}
                />
              </Box>
            )}
          </Box>

          <Box display={'flex'} justifyContent="center" my={6}>
            <Text fontWeight={'400'} fontSize="14px" color={'brand.neutral600'}>
              Designs by
              <Link
                href="https://twitter.com/tachirahomestd"
                color={'brand.primary500'}
              >
                @tachirahomestd
              </Link>
            </Text>
          </Box>
          <Box my={8}>
            <Text
              fontFamily={fonts.interBlack}
              fontSize="24px"
              fontWeight={'bold'}
            >
              Principled Bitcoiners Board
            </Text>
            <Text color={'brand.neutral600'} fontWeight="600">
              The board will be responsible for reviewing and evaluating the
              applications.
            </Text>
          </Box>
          <BoardMembers />

          <MoreInfo titleProps={{ fontSize: '24px' }} />
          <Box my={8}>
            <Text
              fontFamily={fonts.interBlack}
              fontSize="24px"
              fontWeight={'bold'}
            >
              Made possible by sponsors
            </Text>
            <Text color={'brand.neutral600'} fontWeight="600">
              Bitcoin companies and anon individuals that want to bring hope to
              the world.
            </Text>
          </Box>
          <Box
            border={'2px solid #E9ECEF'}
            borderRadius="12px"
            pb={4}
            pt={6}
            bg="brand.bgWhite"
            mt={8}
            mb={3}
            px={4}
            width={isMobile ? '100%' : '909px'}
            display="flex"
            flexDirection={'column'}
            justifyContent="center"
            alignItems={'center'}
          >
            <Box width="100%" display="flex" alignItems={'center'} my={4}>
              <>
                {sponsors && sponsors.length > 0 ? (
                  <Wrap width="100%" justify="center" spacing="25px">
                    {sponsors.map(
                      (sponsor) =>
                        sponsor && (
                          <WrapItem key={sponsor.name}>
                            {sponsor.image ? (
                              <Image
                                borderRadius="4px"
                                height="70px"
                                src={sponsor.image}
                              />
                            ) : null}
                          </WrapItem>
                        ),
                    )}
                  </Wrap>
                ) : (
                  <Box
                    display="flex"
                    width="100%"
                    justifyContent={'center'}
                    gap={4}
                  >
                    {[1, 2].map((item) => (
                      <Box
                        height={'34px'}
                        rounded="full"
                        bg="brand.neutral200"
                        width={'138px'}
                        key={item}
                      ></Box>
                    ))}
                  </Box>
                )}
              </>
            </Box>

            <Box display="flex" alignItems={'center'} mt={2}>
              <Box
                display="flex"
                alignItems={'center'}
                mt="3"
                flexDirection={isMobile ? 'column' : 'row'}
              >
                <GrantsContributeModal />

                <Box
                  display="flex"
                  alignItems={'center'}
                  marginTop={isMobile ? '15px' : '0px'}
                >
                  <Text
                    fontSize={'13px'}
                    fontWeight="500"
                    mr={1}
                    color="brand.neutral600"
                  >
                    Or sending SATs to our lightning address:{' '}
                  </Text>
                  <ButtonComponent
                    size="sm"
                    primary={copy}
                    onClick={handleCopyOnchain}
                    leftIcon={copy ? <RiLinkUnlinkM /> : <RiLinksLine />}
                  >
                    grants@geyser.fund
                  </ButtonComponent>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box my={6}>
            <Text color={'brand.neutral600'} fontWeight="600" mb={4}>
              Thanks to the developers and designers that built and designed
              Geyser Grants.
            </Text>
            <GrantDevelopers />
          </Box>
          <Box
            border={'2px solid #E9ECEF'}
            minWidth="100%"
            p="2"
            rounded={'md'}
            minHeight={'300px'}
          >
            <Text
              fontWeight={'bold'}
              fontSize="large"
              mt={'2'}
              fontFamily={fonts.interBlack}
            >
              Applications
            </Text>
          </Box>
        </Box>
        <AppFooter />
      </Box>
    </>
  )
}
